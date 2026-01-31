"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, X } from "lucide-react";

export default function MainAdminRegistrations() {
  const router = useRouter();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // ================= FETCH REGISTRATIONS =================
  const fetchRegistrations = async () => {
    const token = localStorage.getItem("mainAdminToken");

    if (!token) {
      router.push("/admin/main/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/main/registrations", {
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
  }, []);

  // ================= FILTER =================
  const filteredRegistrations = registrations.filter((r) =>
    r.uniqueCode?.includes(searchCode)
  );

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
              onClick={() => router.push("/admin/main/dashboard")}
              className="px-4 py-2 rounded-md font-bold text-white border-2 border-red-400 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            >
              ← BACK
            </button>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider" style={{
              fontFamily: 'Impact, sans-serif',
              textShadow: '3px 3px 0px rgba(220,38,38,0.8), -1px -1px 0px rgba(0,0,0,0.8)'
            }}>
              ALL REGISTRATIONS
            </h1>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            maxLength={4}
            className="border-2 border-red-500 px-4 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-600 bg-black/60 backdrop-blur-md text-white placeholder-white/50 font-mono font-bold"
          />
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
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              <table className="w-full border-collapse">
                <thead className="bg-red-900/80 backdrop-blur-sm border-b-2 border-red-400">
                  <tr>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Event</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Dept</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Name</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Email</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Phone</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">College</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">P. Dept</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Code</th>
                    <th className="p-4 text-left font-black uppercase tracking-wide">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={`border-t border-white/10 hover:bg-red-600/20 transition-colors ${idx % 2 === 0 ? 'bg-black/20' : 'bg-black/40'
                        }`}
                    >
                      <td className="p-4 font-semibold">{r.eventId?.title}</td>
                      <td className="p-4">
                        <span className="font-bold uppercase text-red-400">
                          {r.eventId?.department || "main"}
                        </span>
                      </td>
                      <td className="p-4">{r.name}</td>
                      <td className="p-4 text-sm text-white/80">{r.email}</td>
                      <td className="p-4">{r.phone}</td>
                      <td className="p-4 text-sm">{r.college || "-"}</td>
                      <td className="p-4 text-sm">{r.participantDepartment || "-"}</td>
                      <td className="p-4">
                        <span className="font-mono font-black text-lg text-red-400 bg-black/60 px-3 py-1 rounded border border-red-500">
                          {r.uniqueCode}
                        </span>
                      </td>
                      <td className="p-4">
                        {r.paymentScreenshot ? (
                          <button
                            onClick={() => setSelectedScreenshot(r.paymentScreenshot)}
                            className="p-2 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all border border-red-500/30 active:scale-90"
                            title="View Screenshot"
                          >
                            <Eye size={20} />
                          </button>
                        ) : (
                          <span className="text-white/20 text-xs italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS & SMALL TABLEFALLBACK */}
            <div className="lg:hidden space-y-4">
              {filteredRegistrations.map((r) => (
                <div
                  key={r._id}
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-5 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <h3 className="font-black text-lg text-red-400 uppercase pr-2">
                        {r.eventId?.title}
                      </h3>
                      <p className="text-[10px] text-white/60 font-bold uppercase mt-1">
                        {r.eventId?.department} Dept
                      </p>
                      <span className="text-xs text-white/40 mt-1">{r.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.paymentScreenshot && (
                        <button
                          onClick={() => setSelectedScreenshot(r.paymentScreenshot)}
                          className="p-2 rounded-full bg-red-600/20 text-red-400 border border-red-500/30"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <span className="font-mono font-black text-sm text-red-400 bg-black/60 px-3 py-1 rounded border border-red-500 whitespace-nowrap">
                        {r.uniqueCode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm mt-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Name</p>
                      <p className="text-white font-medium">{r.name}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Phone</p>
                      <p className="text-white font-mono">{r.phone}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">College</p>
                      <p className="text-white truncate">{r.college || "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">P. Dept</p>
                      <p className="text-white">{r.participantDepartment || "-"}</p>
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-2 text-white hover:text-red-400 transition-colors bg-black/50 rounded-full z-10"
            >
              <X size={32} />
            </button>
            {/* Image Container - properly constrained */}
            <div className="w-full h-[calc(100%-8rem)] flex items-center justify-center">
              <div className="relative max-w-full max-h-full drop-shadow-[6px_6px_0px_#000] drop-shadow-red-900">
                <img
                  src={selectedScreenshot}
                  alt="Payment Screenshot"
                  className="max-w-[90vw] max-h-[75vh] w-auto h-auto object-contain rounded-md bg-black"
                />
              </div>
            </div>

            <p className="mt-4 text-white font-black uppercase tracking-tighter text-xl italic drop-shadow-lg">
              Payment Verification
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
