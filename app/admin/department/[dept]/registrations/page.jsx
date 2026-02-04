"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, X } from "lucide-react";

export default function DepartmentRegistrations() {
  const { dept } = useParams();
  const router = useRouter();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 SEARCH STATES
  const [searchEmailOrPhone, setSearchEmailOrPhone] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

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
  const filteredRegistrations = registrations.filter((r) => {
    const emailOrPhoneMatch = searchEmailOrPhone
      ? r.email?.toLowerCase().includes(searchEmailOrPhone.toLowerCase()) ||
        r.phone?.includes(searchEmailOrPhone)
      : true;

    const codeMatch = searchCode
      ? r.uniqueCode?.includes(searchCode)
      : true;

    return emailOrPhoneMatch && codeMatch;
  });

  // ================= UI =================
  return (
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-20">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push(`/admin/department/${dept}/dashboard`)
              }
              className="px-4 py-2 rounded-md font-bold text-white border-2 border-red-400 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            >
              ← BACK
            </button>

            <h1
              className="text-2xl sm:text-4xl font-black uppercase tracking-wider"
              style={{
                fontFamily: "Impact, sans-serif",
                textShadow:
                  "3px 3px 0px rgba(220,38,38,0.8), -1px -1px 0px rgba(0,0,0,0.8)",
              }}
            >
              {dept} REGISTRATIONS
            </h1>
          </div>

          {/* 🔍 SEARCH INPUTS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search email or phone..."
              value={searchEmailOrPhone}
              onChange={(e) => setSearchEmailOrPhone(e.target.value)}
              className="border-2 border-red-500 px-4 py-2 rounded-md w-full sm:w-64 bg-black/60 text-white font-bold"
            />

            <input
              type="text"
              placeholder="Search code..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              maxLength={4}
              className="border-2 border-red-500 px-4 py-2 rounded-md w-full sm:w-40 bg-black/60 text-white font-mono font-bold"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xl font-bold">LOADING REGISTRATIONS...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xl text-white/70">NO REGISTRATION FOUND.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE (UNCHANGED) */}
            <div className="hidden lg:block overflow-x-auto bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
              <table className="w-full">
                <thead className="bg-red-900/80">
                  <tr>
                    <th className="p-4 text-left">Event</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">College</th>
                    <th className="p-4 text-left">Dept</th>
                    <th className="p-4 text-left">Code</th>
                    <th className="p-4 text-left">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((r, idx) => (
                    <tr key={r._id} className={idx % 2 ? "bg-black/40" : "bg-black/20"}>
                      <td className="p-4">{r.eventId?.title}</td>
                      <td className="p-4">{r.name}</td>
                      <td className="p-4">{r.email}</td>
                      <td className="p-4">{r.phone}</td>
                      <td className="p-4">{r.college || "-"}</td>
                      <td className="p-4">{r.participantDepartment || "-"}</td>
                      <td className="p-4 font-mono text-red-400">{r.uniqueCode}</td>
                      <td className="p-4">
                        {r.paymentScreenshot && (
                          <button onClick={() => setSelectedScreenshot(r.paymentScreenshot)}>
                            <Eye />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE CARDS (ONLY ENHANCED, NOT REPLACED) */}
            <div className="lg:hidden space-y-4">
              {filteredRegistrations.map((r) => (
                <div
                  key={r._id}
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg text-red-400">
                        {r.eventId?.title}
                      </h3>
                      <p className="text-sm"><b>Name:</b> {r.name}</p>
                      <p className="text-sm break-all"><b>Email:</b> {r.email}</p>
                      <p className="text-sm"><b>Phone:</b> {r.phone}</p>
                      <p className="text-sm"><b>College:</b> {r.college || "-"}</p>
                      <p className="text-sm"><b>Dept:</b> {r.participantDepartment || "-"}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {r.paymentScreenshot && (
                        <button
                          onClick={() =>
                            setSelectedScreenshot(r.paymentScreenshot)
                          }
                          className="p-2 rounded-full bg-red-600/20 text-red-400 border border-red-500/30"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <span className="font-mono text-red-400">
                        {r.uniqueCode}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SCREENSHOT MODAL */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={() => setSelectedScreenshot(null)}
        >
          <button className="absolute top-4 right-4 text-white">
            <X size={32} />
          </button>
          <img
            src={selectedScreenshot}
            className="max-w-[90vw] max-h-[80vh]"
          />
        </div>
      )}
    </main>
  );
}
