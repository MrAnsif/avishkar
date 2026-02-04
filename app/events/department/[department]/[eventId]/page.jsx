'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs";

const EventRegisterPage = () => {
  const { eventId } = useParams()
  const router = useRouter()
  const { getToken } = useAuth()

  // State
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successCode, setSuccessCode] = useState(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    college: '',
    participantDepartment: '',
    participantType: '',
    semester: '',
    school: '',
    schoolClass: '',
    teamMembers: [''],
    paymentScreenshot: null,
    paymentScreenshotBase64: null,
  })

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`)
        const data = await res.json()

        console.log('EVENT DATA', data)
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch event')
        }

        setEvent(data)
        setError(null)

        if (data.type === 'team' && data.teamSize > 1) {
          setForm(prev => ({
            ...prev,
            teamMembers: Array(data.teamSize).fill(''),
          }))
        }
      } catch (err) {
        console.error('Failed to fetch event', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) fetchEvent()
  }, [eventId])

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleTeamChange = (i, value) => {
    const arr = [...form.teamMembers]
    arr[i] = value
    setForm(prev => ({ ...prev, teamMembers: arr }))
  }

  const addTeamMember = () => {
    if (event && form.teamMembers.length < event.teamSize) {
      setForm(prev => ({ ...prev, teamMembers: [...prev.teamMembers, ''] }))
    }
  }

  const removeTeamMember = (index) => {
    if (form.teamMembers.length > 1) {
      const arr = form.teamMembers.filter((_, i) => i !== index)
      setForm(prev => ({ ...prev, teamMembers: arr }))
    }
  }

  const handleFileChange = (file) => {
    if (!file) {
      setForm(prev => ({
        ...prev,
        paymentScreenshot: null,
        paymentScreenshotBase64: null,
      }))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        paymentScreenshot: file,
        paymentScreenshotBase64: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(event.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const filteredTeamMembers = form.teamMembers.filter(m => m.trim() !== '')
      if (event.type === 'team' && filteredTeamMembers.length !== event.teamSize) {
        throw new Error(`Team must have exactly ${event.teamSize} members`)
      }
      const payload = {
        eventId: event._id,
        name: form.name,
        age: parseInt(form.age),
        email: form.email,
        phone: form.phone,
        participantType: form.participantType,
        college: form.participantType === 'college' ? form.college : form.school,
        participantDepartment:
          form.participantType === 'college' ? form.participantDepartment : null,
        semester: form.participantType === 'college' ? form.semester : null,
        school: form.participantType === 'school' ? form.school : null,
        schoolClass: form.participantType === 'school' ? form.schoolClass : null,
        teamMembers: event.type === 'team' ? filteredTeamMembers : [],
        paymentScreenshot: form.paymentScreenshotBase64,
      }

      const token = await getToken()
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          alert('Already Registered!\n\nYou have already registered for this event. Check "My Registrations" to view your entry code.')
          router.push('/events/my-registrations')
          return
        }
        throw new Error(data.message || 'Registration failed')
      }
      setSuccessCode(data.registration.uniqueCode)
      setTimeout(() => {
        router.push('/events/my-registrations')
      }, 4000)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">Error</p>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 rounded-lg border border-white/30 hover:border-red-500"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (successCode) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
        />
        <div className="fixed inset-0 bg-black/70" />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0
                      9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="deadpool-heading text-2xl mb-4 text-white">
              Registration Successful!
            </h2>
            <p className="text-white/80 mb-6">Your unique code is:</p>
            <div className="bg-black/60 border border-red-500/40 rounded-lg p-4 mb-6">
              <p className="text-4xl font-bold text-red-400 tracking-wider">
                {successCode}
              </p>
            </div>
            <p className="text-sm text-white/60">
              Save this code for verification at the event.
            </p>
            <p className="text-xs text-white/40 mt-2">
              Redirecting to your registrations...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 min-h-screen text-white flex justify-center px-4 py-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 space-y-5"
        >
          {/* EVENT META */}
          <div className="text-center space-y-2">
            <h1 className="deadpool-heading text-3xl">
              {event.title}
            </h1>
            <p className="text-sm text-white/80">
              {event.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm mt-2">
              <span className="text-white/60">
                {event.type === 'team' ? `Team of ${event.teamSize}` : 'Individual'}
              </span>
              <span className="text-red-400 font-semibold">₹{event.amount}</span>
            </div>

            {/* Event Timing Details */}
            <div className="mt-4 p-3 rounded-lg bg-black/50 border border-white/20 text-left space-y-1.5">
              <div className="text-sm">
                <span className="text-white/60">Start: </span>
                <span className="text-white/90">
                  {new Date(event.startTime).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })} at {new Date(event.startTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">End: </span>
                <span className="text-white/90">
                  {new Date(event.endTime).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })} at {new Date(event.endTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-white/60">Registration Deadline: </span>
                <span className="text-red-400 font-semibold">
                  {new Date(event.registrationDeadline).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })} at {new Date(event.registrationDeadline).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/20">
            <p className="text-sm font-semibold mb-2 text-red-400">Rules</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
              {event.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* FORM */}
          <Field label="Full Name" value={form.name} onChange={v => handleChange('name', v)} />
          <Field label="Age" type="number" value={form.age} onChange={v => handleChange('age', v)} />
          <Field label="Email" type="email" value={form.email} onChange={v => handleChange('email', v)} />
          <Field label="Phone" value={form.phone} onChange={v => handleChange('phone', v)} />

          {/* Participant Type FIRST */}
          <div className="space-y-1">
            <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
              Participant Type
            </label>
            <select
              required
              value={form.participantType}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-black/60
                border border-white/30
                text-base text-white
                shadow-inner
                focus:outline-none
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/40
              "
              onChange={(e) => handleChange('participantType', e.target.value)}
            >
              <option value="">Select</option>
              <option value="college">College</option>
              <option value="school">School</option>
            </select>
          </div>

          <Field
            label={
              form.participantType === 'college'
                ? 'College Name'
                : form.participantType === 'school'
                  ? 'School Name'
                  : 'College / School Name'
            }
            value={form.participantType === 'college' ? form.college : form.school}
            onChange={v =>
              handleChange(
                form.participantType === 'college' ? 'college' : 'school',
                v
              )
            }
          />

          {/* Department only for College */}
          {form.participantType === 'college' && (
            <Field
              label="Department"
              value={form.participantDepartment}
              onChange={v => handleChange('participantDepartment', v)}
            />
          )}

          {form.participantType === 'college' && (
            <div className="p-3 rounded-lg border border-blue-400/40 bg-blue-500/10">
              <Field
                label="Semester"
                value={form.semester}
                onChange={v => handleChange('semester', v)}
              />
            </div>
          )}

          {form.participantType === 'school' && (
            <div className="p-3 rounded-lg border border-green-400/40 bg-green-500/10">
              <Field
                label="Class"
                value={form.schoolClass}
                onChange={v => handleChange('schoolClass', v)}
              />
            </div>
          )}

          {/* Team */}
          {event.type === 'team' && (
            <div className="space-y-2">
              <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
                Team Members ({event.teamSize} required)
              </label>
              {form.teamMembers.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    required
                    value={m}
                    className="
                      flex-1 px-4 py-2.5 rounded-lg
                      bg-black/60
                      border border-white/30
                      text-base text-white
                      shadow-inner
                      focus:outline-none
                      focus:border-red-500
                      focus:ring-2 focus:ring-red-500/40
                    "
                    placeholder={`Member ${i + 1} Name`}
                    onChange={e => handleTeamChange(i, e.target.value)}
                  />
                  {form.teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(i)}
                      className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/20"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {form.teamMembers.length < event.teamSize && (
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  + Add member ({form.teamMembers.length}/{event.teamSize})
                </button>
              )}
            </div>
          )}

          {/* PAYMENT BLOCK */}
          <div className="p-4 rounded-xl border border-red-500/40 bg-black/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm text-white/80">GPay Number</p>
                <p className="text-lg text-red-400 font-mono">{event.upiId}</p>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg border border-white/30 bg-black/60 hover:border-red-500 hover:bg-red-500/10 transition-all text-sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm">Amount: ₹{event.amount}</p>
            <p className="text-xs text-white/60">Event Registration Fee</p>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
              Upload Payment Screenshot *
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="screenshot"
                className="
                  cursor-pointer px-3 py-1.5 rounded-md
                  text-sm
                  border border-white/30
                  bg-black/60
                  hover:border-red-500 hover:text-red-400
                  transition-all
                "
              >
                Choose File
              </label>
              <span className="text-xs text-white/70">
                {form.paymentScreenshot
                  ? form.paymentScreenshot.name
                  : 'No file selected'}
              </span>
            </div>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={!form.paymentScreenshot || submitting}
            className={`
              w-full mt-4 py-2.5 rounded-full
              border border-white/30
              transition-all
              ${form.paymentScreenshot && !submitting
                ? 'hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_25px_rgba(220,38,38,0.75)]'
                : 'opacity-40 cursor-not-allowed'
              }
            `}
          >
            {submitting ? 'Submitting...' : 'Submit & Generate Code'}
          </button>
        </form>
      </div>
    </div>
  )
}

const Field = ({ label, type = 'text', value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
      {label}
    </label>
    <input
      required
      type={type}
      value={value}
      className="
        w-full px-4 py-2.5 rounded-lg
        bg-black/60
        border border-white/30
        text-base text-white
        placeholder-white/40
        shadow-inner
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/40
      "
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

export default EventRegisterPage