'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const EventRegisterPage = () => {
  const { eventId } = useParams()
  const router = useRouter()

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

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch event')
        }

        setEvent(data)

        if (data.type === 'team' && data.teamSize > 1) {
          setForm(prev => ({
            ...prev,
            teamMembers: Array(data.teamSize).fill(''),
          }))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) fetchEvent()
  }, [eventId])

  /* ================= FORM HELPERS ================= */
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleTeamChange = (i, value) => {
    const arr = [...form.teamMembers]
    arr[i] = value
    setForm(prev => ({ ...prev, teamMembers: arr }))
  }

  const handleFileChange = (file) => {
    if (!file) return

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
    await navigator.clipboard.writeText(event.upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ================= SUBMIT ================= */
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
        college: form.participantType === 'college' ? form.college : null,
        participantDepartment:
          form.participantType === 'college' ? form.participantDepartment : null,
        semester: form.participantType === 'college' ? form.semester : null,
        school: form.participantType === 'school' ? form.school : null,
        schoolClass: form.participantType === 'school' ? form.schoolClass : null,
        teamMembers: event.type === 'team' ? filteredTeamMembers : [],
        paymentScreenshot: form.paymentScreenshotBase64,
      }

      /* ✅ CRITICAL FIX:
         - NO auth.getToken()
         - NO Authorization header
         - USE cookies via credentials: 'include'
      */
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          alert('Already registered for this event')
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
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event details...
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (successCode) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-2xl mb-4">Registration Successful</h2>
          <p className="mb-2">Your Code:</p>
          <p className="text-4xl font-bold text-red-400">{successCode}</p>
          <p className="text-sm mt-4">Redirecting…</p>
        </div>
      </div>
    )
  }

  /* ================= FORM ================= */
  return (
    <div className="min-h-screen flex justify-center py-24 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-black/60 p-8 rounded-xl space-y-4"
      >
        <h1 className="text-3xl text-center">{event.title}</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Field label="Name" value={form.name} onChange={v => handleChange('name', v)} />
        <Field label="Age" type="number" value={form.age} onChange={v => handleChange('age', v)} />
        <Field label="Email" type="email" value={form.email} onChange={v => handleChange('email', v)} />
        <Field label="Phone" value={form.phone} onChange={v => handleChange('phone', v)} />

        <select
          required
          value={form.participantType}
          onChange={e => handleChange('participantType', e.target.value)}
          className="w-full px-3 py-2 bg-black border border-white/30 rounded"
        >
          <option value="">Select Participant Type</option>
          <option value="college">College</option>
          <option value="school">School</option>
        </select>

        {form.participantType === 'college' && (
          <>
            <Field label="College" value={form.college} onChange={v => handleChange('college', v)} />
            <Field label="Department" value={form.participantDepartment} onChange={v => handleChange('participantDepartment', v)} />
            <Field label="Semester" value={form.semester} onChange={v => handleChange('semester', v)} />
          </>
        )}

        {form.participantType === 'school' && (
          <>
            <Field label="School" value={form.school} onChange={v => handleChange('school', v)} />
            <Field label="Class" value={form.schoolClass} onChange={v => handleChange('schoolClass', v)} />
          </>
        )}

        <input
          type="file"
          accept="image/*"
          required
          onChange={e => handleFileChange(e.target.files[0])}
        />

        <button
          disabled={submitting}
          className="w-full py-2 border border-white/40 rounded hover:border-red-500"
        >
          {submitting ? 'Submitting…' : 'Submit & Generate Code'}
        </button>
      </form>
    </div>
  )
}

const Field = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      required
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-black border border-white/30 rounded"
    />
  </div>
)

export default EventRegisterPage