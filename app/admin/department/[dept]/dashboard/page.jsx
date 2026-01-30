"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DepartmentDashboard() {
  const params = useParams();
  const router = useRouter();
  const [events, setEvents] = useState([]);

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
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-600">
          <h2 className="text-xl font-bold uppercase">{dept} Admin</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Department Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href={`/admin/department/${dept}/dashboard`}
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            📋 Events
          </Link>

          <Link
            href={`/admin/department/${dept}/events/add`}
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            ➕ Add Event
          </Link>

          <Link
            href={`/admin/department/${params.dept}/registrations`}
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            🧾 Registrations
          </Link>
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/admin/department");
            }}
            className="w-full px-4 py-2 rounded-lg text-red-200 hover:bg-red-500 hover:text-white"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Events</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e._id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{e.title}</h3>

              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-sm ${
                    e.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {e.isActive ? "Active" : "Disabled"}
                </span>

                <button
                  onClick={() => toggleStatus(e._id, e.isActive)}
                  className={`px-3 py-1 text-white rounded ${
                    e.isActive ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {e.isActive ? "Disable" : "Enable"}
                </button>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                {/* ✅ Updated Edit Button Path */}
                <button
                  onClick={() =>
                    router.push(
                      `/admin/department/${dept}/events/${e._id}/edit`
                    )
                  }
                  className="flex-1 bg-blue-500 text-white py-1.5 rounded hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => deleteEvent(e._id)}
                  className="flex-1 bg-red-500 text-white py-1.5 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
