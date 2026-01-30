'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"

export default function MyRegistrationsPage() {
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [error, setError] = useState(null)
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return

    // Redirect if not signed in
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/events/my-registrations")
      return
    }

    const loadRegistrations = async () => {
      try {
        // Get Clerk JWT token
        const token = await getToken()

        if (!token) {
          throw new Error("Failed to get authentication token")
        }

        const res = await fetch("/api/events/my-registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          // Handle authentication errors specifically
          if (res.status === 401) {
            router.push("/sign-in?redirect_url=/events/my-registrations")
            return
          }
          throw new Error(data.message || "Failed to fetch registrations")
        }

        setRegistrations(data.registrations || [])
      } catch (err) {
        console.error("REG FETCH ERROR:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadRegistrations()
  }, [isLoaded, isSignedIn, getToken, router])

  // Auth Loading State
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your registrations...</p>
        </div>
      </div>
    )
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center max-w-sm p-6 bg-black/40 border border-red-500/40 rounded-xl backdrop-blur-md">
          <p className="text-red-500 text-xl mb-3">Error</p>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg border border-white/30 hover:border-red-500 hover:text-red-400"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (registrations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="deadpool-heading text-3xl">No Registrations Found</h2>
          <p className="text-white/70">You haven't registered for any events yet.</p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-2 rounded-lg border border-white/30 hover:border-red-500 hover:text-red-400"
          >
            Browse Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />
      
      {/* Registrations List */}
      <div className="relative z-10 pt-24 pb-16 px-6 max-w-3xl mx-auto text-white">
        <div className="flex justify-between items-center mb-10">
          <h1 className="deadpool-heading text-4xl">
            My Event Registrations
          </h1>
          {user && (
            <p className="text-white/60 text-sm">
              {user.firstName || user.emailAddresses[0].emailAddress}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {registrations.map((reg) => {
            const event = reg.eventId
            return (
              <div
                key={reg._id}
                className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4"
              >
                {/* EVENT TITLE */}
                <div className="flex justify-between items-center">
                  <h2 className="deadpool-heading text-2xl">{event.title}</h2>
                  <span className="text-red-400 font-semibold text-lg">₹{event.amount}</span>
                </div>
                
                {/* DESCRIPTION */}
                <p className="text-white/70 text-sm">{event.description}</p>
                
                {/* TYPE + CATEGORY */}
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>
                    {event.type === "team"
                      ? `Team Event (${event.teamSize} members)`
                      : "Individual Event"}
                  </span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/70 capitalize">{event.eventCategory}</span>
                </div>
                
                {/* RULES */}
                <div className="p-3 rounded-lg bg-black/50 border border-white/20">
                  <p className="text-sm font-semibold text-red-400 mb-2">Rules</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-white/70">
                    {event.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                
                {/* UNIQUE CODE */}
                <div className="p-4 rounded-xl bg-black/60 border border-red-500/40">
                  <p className="text-white/70 text-sm mb-1">Your Unique Code</p>
                  <p className="text-3xl text-red-400 font-bold tracking-wider">
                    {reg.uniqueCode}
                  </p>
                </div>
                
                {/* TIMESTAMP */}
                <div className="text-sm text-white/70">
                  <p>
                    Registered on{" "}
                    <span className="text-white/90">
                      {new Date(reg.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
                
                {/* VIEW EVENT BUTTON */}
                <button
                  onClick={() => router.push(`/events/${event._id}`)}
                  className="
                    w-full mt-3 py-2 rounded-lg border border-white/30
                    hover:border-red-500 hover:text-red-400
                    transition-all
                  "
                >
                  View Event
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}