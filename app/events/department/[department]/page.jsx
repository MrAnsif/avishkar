'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function DepartmentEventsPage() {
  const { department } = useParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/events/department/${department}`)
        const data = await res.json()
        console.log('asdfasdf', data)
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch events')
        }

        setEvents(data.events || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch department events', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (department) fetchEvents()
  }, [department])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">Error</p>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-8 py-20">
        {/* HEADING */}
        <h1 className="deadpool-heading text-4xl mb-10 uppercase">
          {department} EVENTS
        </h1>

        {events.length === 0 ? (
          <p className="text-white/70">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/events/department/${department}/${event._id}`}
                className="group"
              >
                <div className="rounded-xl overflow-hidden border border-white/20 bg-black/40 backdrop-blur-md p-4 transition-all hover:scale-[1.02]">

                  <div className="relative w-full aspect-[3/4] mb-4">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-contain group-hover:drop-shadow-[0_0_30px_rgba(220,38,38,0.7)]"
                    />
                  </div>

                  <h2 className="deadpool-heading text-xl mb-1">
                    {event.title}
                  </h2>

                  <p className="text-sm text-white/70">
                    {event.type === 'team'
                      ? `Team of ${event.teamSize}`
                      : 'Single'}
                  </p>

                  <p className="text-sm mt-1">
                    ₹{event.amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}