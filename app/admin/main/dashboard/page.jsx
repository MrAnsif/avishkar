"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MainAdminDashboard() {
  const [events, setEvents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    const token = localStorage.getItem("mainAdminToken");
    if (!token) {
      window.location.href = "/admin/main/login";
      return;
    }

    const res = await fetch("/api/admin/main/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data.events || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Enable / Disable event
  const toggleStatus = async (id, isActive) => {
    const token = localStorage.getItem("mainAdminToken");

    await fetch("/api/admin/main/events", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId: id, isActive: !isActive }),
    });

    fetchEvents();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700">

      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/60 text-white flex items-center justify-between px-4 py-3">
        <button
          className="text-2xl"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        <h2 className="font-bold">🎉 Avishkar Admin</h2>
      </div>

      {/* 🔵 Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-black/40 text-white p-6
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-8">🎉 Avishkar</h2>

        <nav className="space-y-4">
          <Link href="/admin/main/dashboard" className="block hover:text-pink-300">
            📊 Dashboard
          </Link>

          <Link href="/admin/main/events/add" className="block hover:text-pink-300">
            ➕ Add Event
          </Link>

          <Link href="/admin/main/registrations" className="block hover:text-pink-300">
            🧾 Registrations
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("mainAdminToken");
              window.location.href = "/admin/main/login";
            }}
            className="text-red-300 hover:text-red-500 mt-4"
          >
            🚪 Logout
          </button>
        </nav>

        {/* ❌ Close button (mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 text-xl"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
      </aside>

      {/* 🟢 Main Content */}
      <main className="flex-1 p-6 bg-white rounded-l-3xl mt-14 md:mt-0">
        <h1 className="text-3xl font-bold mb-6 text-left">
          Main Admin Dashboard
        </h1>

        {/* 📋 Events List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{event.eventCategory} event</p>
              <p className="mt-2 font-medium">
                Status:
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded
                    ${event.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"}`}
                >
                  {event.isActive ? "Active" : "Disabled"}
                </span>
              </p>
              <button
                onClick={() => toggleStatus(event._id, event.isActive)}
                className={`mt-4 w-full py-2 rounded text-white font-semibold
                  ${event.isActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"}`}
              >
                {event.isActive ? "Disable Event" : "Enable Event"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
