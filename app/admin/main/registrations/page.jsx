"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, X } from "lucide-react";

export default function MainAdminRegistrations() {
  const router = useRouter();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Combined Email / Mobile search
  const [contactSearch, setContactSearch] = useState("");
  const [codeSearch, setCodeSearch] = useState("");

  // Default sorting (no UI)
  const [sortBy] = useState("uniqueCode");

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
        headers: { Authorization: `Bearer ${token}` },
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

  // ================= FILTER + SORT =================
  const processedRegistrations = [...registrations]
    .filter((r) => {
      if (
        contactSearch &&
        !(
          r.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
          r.phone?.includes(contactSearch)
        )
      )
        return false;

      if (codeSearch && !r.uniqueCode?.includes(codeSearch)) return false;

      return true;
    })
    .sort((a, b) => {
      if (!a[sortBy] || !b[sortBy]) return 0;
      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    });

  return (
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-4 sm:px-8 py-6 sm:py-20">
        {/* HEADER */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/main/dashboard")}
              className="px-3 py-2 border-2 border-red-400 rounded-md font-bold"
            >
              ← Back
            </button>
            <h1 className="text-xl sm:text-4xl font-black uppercase">
              All Registrations
            </h1>
          </div>

          {/* SEARCH BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Search Email or Mobile"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="border-2 border-red-500 px-3 py-2 rounded-md bg-black/70"
            />
            <input
              placeholder="Search Code"
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
              className="border-2 border-red-500 px-3 py-2 rounded-md bg-black/70"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-20 font-bold">
            Loading registrations…
          </div>
        ) : processedRegistrations.length === 0 ? (
          <div className="text-center py-20 text-white/70">
            No registrations found
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto bg-black/40 rounded-xl border border-white/20">
              <table className="w-full">
                <thead className="bg-red-900/80">
                  <tr>
                    {[
                      "Event",
                      "Dept",
                      "Name",
                      "Email",
                      "Phone",
                      "College",
                      "P. Dept",
                      "Code",
                      "Payment",
                    ].map((h) => (
                      <th key={h} className="p-4 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedRegistrations.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={idx % 2 ? "bg-black/40" : "bg-black/20"}
                    >
                      <td className="p-4">{r.eventId?.title}</td>
                      <td className="p-4 text-red-400">
                        {r.eventId?.department}
                      </td>
                      <td className="p-4">{r.name}</td>
                      <td className="p-4">{r.email}</td>
                      <td className="p-4">{r.phone}</td>
                      <td className="p-4">{r.college || "-"}</td>
                      <td className="p-4">
                        {r.participantDepartment || "-"}
                      </td>
                      <td className="p-4 font-mono text-red-400">
                        {r.uniqueCode}
                      </td>
                      <td className="p-4">
                        {r.paymentScreenshot && (
                          <button
                            onClick={() =>
                              setSelectedScreenshot(r.paymentScreenshot)
                            }
                          >
                            <Eye />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE CARDS */}
            <div className="lg:hidden space-y-4">
              {processedRegistrations.map((r) => (
                <div
                  key={r._id}
                  className="bg-black/50 border border-white/20 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-red-400 font-black text-lg">
                        {r.eventId?.title}
                      </p>
                      <p className="text-xs text-white/60">
                        {r.eventId?.department} Dept
                      </p>
                    </div>
                    <span className="font-mono text-red-400 bg-black/60 px-2 py-1 rounded">
                      {r.uniqueCode}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      <b>Name:</b> {r.name}
                    </p>
                    <p className="break-all">
                      <b>Email:</b> {r.email}
                    </p>
                    <p>
                      <b>Phone:</b> {r.phone}
                    </p>
                    <p>
                      <b>College:</b> {r.college || "-"}
                    </p>
                    <p>
                      <b>P. Dept:</b> {r.participantDepartment || "-"}
                    </p>
                  </div>

                  {r.paymentScreenshot && (
                    <button
                      onClick={() =>
                        setSelectedScreenshot(r.paymentScreenshot)
                      }
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500 rounded-md py-2"
                    >
                      <Eye size={18} /> View Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SCREENSHOT MODAL */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
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
