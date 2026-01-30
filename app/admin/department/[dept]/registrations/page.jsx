"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DepartmentRegistrations() {
  const { dept } = useParams();
  const router = useRouter();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");

  // ================= FETCH REGISTRATIONS =================
  const fetchRegistrations = async () => {
    const token = localStorage.getItem("deptAdminToken");
    const storedDept = localStorage.getItem("department");

    if (!token || storedDept !== dept) {
      router.push(`/admin/department/${dept}/login`);
      return;
    }

    try {
      const res = await fetch("/api/admin/department/registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [dept]);

  // ================= FILTER =================
  const filteredRegistrations = registrations.filter((r) =>
    r.uniqueCode?.includes(searchCode)
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              router.push(`/admin/department/${dept}/dashboard`)
            }
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold">
            Event Registrations ({dept.toUpperCase()})
          </h1>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search 4-digit code..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          maxLength={4}
          className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading registrations...</p>
      ) : filteredRegistrations.length === 0 ? (
        <p className="text-gray-500">No registration found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">College</th>
                <th className="p-3 text-left">Participant Dept</th>
                <th className="p-3 text-left">Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.eventId?.title}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">{r.college || "-"}</td>
                  <td className="p-3">
                    {r.participantDepartment || "-"}
                  </td>
                  <td className="p-3 font-mono font-semibold text-indigo-600">
                    {r.uniqueCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}