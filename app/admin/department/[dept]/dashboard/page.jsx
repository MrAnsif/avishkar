"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DepartmentDashboard() {
  const params = useParams();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dept = Array.isArray(params.dept)
    ? params.dept[0]
    : params.dept;

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    if (!dept) return;

    const token = localStorage.getItem("deptAdminToken");
    const storedDept = localStorage.getItem("department");

    if (!token || storedDept !== dept) {
      router.push(`/admin/department/${dept}/login`);
      return;
    }

    const res = await fetch(`/api/admin/department/${dept}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setEvents(data.events || []);
  };

  useEffect(() => {
    fetchEvents();
  }, [dept]);

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (id, isActive) => {
    const token = localStorage.getItem("deptAdminToken");

    await fetch("/api/admin/events", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId: id, isActive: !isActive }),
    });

    fetchEvents();
  };

  // ================= DELETE EVENT =================
  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const token = localStorage.getItem("deptAdminToken");

    await fetch("/api/admin/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId: id }),
    });

    fetchEvents();
  };

  return (
    <div
      className="min-h-screen flex bg-cover bg-center relative"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 lg:w-72 bg-black/80 backdrop-blur-md text-white flex-col border-r-2 border-red-500/30 z-20">
        <div className="p-6 border-b-2 border-red-500/30">
          <h2 className="admin-heading text-2xl lg:text-3xl uppercase">{dept}</h2>
          <p className="text-xs text-white/60 mt-2 uppercase tracking-widest">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href={`/admin/department/${dept}/dashboard`}
            className="block px-4 py-3 rounded-lg bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 hover:border-red-500/50 transition-all font-semibold"
          >
            📋 Events
          </Link>

          <Link
            href={`/admin/department/${dept}/events/add`}
            className="block px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all font-semibold"
          >
            ➕ Add Event
          </Link>

          <Link
            href={`/admin/department/${params.dept}/registrations`}
            className="block px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all font-semibold"
          >
            🧾 Registrations
          </Link>
        </nav>

        <div className="p-4 border-t-2 border-red-500/30">
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/admin/department");
            }}
            className="w-full px-4 py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all uppercase tracking-wide"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-md border-b-2 border-red-500/30">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="admin-heading text-xl uppercase">{dept}</h2>
            <p className="text-xs text-white/60 uppercase">Admin</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 p-4 space-y-2">
            <Link
              href={`/admin/department/${dept}/dashboard`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg bg-red-600/20 border border-red-500/30 text-white font-semibold"
            >
              📋 Events
            </Link>

            <Link
              href={`/admin/department/${dept}/events/add`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-white font-semibold"
            >
              ➕ Add Event
            </Link>

            <Link
              href={`/admin/department/${params.dept}/registrations`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-white font-semibold"
            >
              🧾 Registrations
            </Link>

            <button
              onClick={() => {
                localStorage.clear();
                router.push("/admin/department");
              }}
              className="w-full px-4 py-3 rounded-lg bg-red-600/80 text-white font-bold uppercase"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <main className="relative flex-1 md:ml-64 lg:ml-72 p-4 sm:p-6 md:p-8 mt-20 md:mt-0 z-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="admin-heading text-3xl sm:text-4xl md:text-5xl uppercase mb-2">
            Events Dashboard
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Manage your department events
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="rounded-xl border-2 border-white/20 bg-black/40 backdrop-blur-md p-8 sm:p-12 inline-block">
              <p className="text-white/70 text-lg sm:text-xl mb-4">No events yet</p>
              <Link
                href={`/admin/department/${dept}/events/add`}
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
              >
                ➕ Create First Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {events.map((e) => (
              <div
                key={e._id}
                className="rounded-xl overflow-hidden border-2 border-white/20 bg-black/40 backdrop-blur-md p-4 sm:p-5 transition-all hover:scale-[1.02] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              >
                <h3 className="font-bold text-lg sm:text-xl text-white mb-3 line-clamp-2">
                  {e.title}
                </h3>

                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wide text-white/60">
                    Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${e.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                      }`}
                  >
                    {e.isActive ? "● Active" : "○ Disabled"}
                  </span>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleStatus(e._id, e.isActive)}
                  className={`w-full px-4 py-2 rounded-lg font-semibold text-sm mb-3 transition-all ${e.isActive
                    ? "bg-red-500/80 hover:bg-red-600 text-white"
                    : "bg-green-500/80 hover:bg-green-600 text-white"
                    }`}
                >
                  {e.isActive ? "🔴 Disable Event" : "🟢 Enable Event"}
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/department/${dept}/events/${e._id}/edit`
                      )
                    }
                    className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteEvent(e._id)}
                    className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}