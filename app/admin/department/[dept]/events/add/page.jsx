"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AddEventPage() {
  const { dept } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "individual", // ✅ FIXED (matches schema)
    teamSize: 1,
    upiId: "",
    amount: "",
    rules: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
  });

  // 🔐 Convert image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("deptAdminToken");
    if (!token) {
      router.push(`/admin/department/${dept}/login`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          eventCategory: "department", // ✅ fixed by system
          type: form.type, // single | team
          teamSize: form.type === "team" ? Number(form.teamSize) : 1,
          upiId: form.upiId,
          amount: Number(form.amount),
          rules: form.rules.split("\n").filter(Boolean), // ✅ ARRAY
          startTime: form.startTime,
          endTime: form.endTime,
          registrationDeadline: form.registrationDeadline,
          imageBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add event");
        return;
      }

      alert("✅ Event added successfully");
      router.push(`/admin/department/${dept}/dashboard`);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <button
            onClick={() => router.push(`/admin/department/${dept}/dashboard`)}
            className="text-white/70 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="admin-heading text-3xl sm:text-4xl md:text-5xl uppercase mb-2">
            ➕ Add New Event
          </h1>
          <div className="inline-block px-4 py-2 bg-red-600/80 rounded-lg">
            <p className="text-sm sm:text-base font-bold uppercase tracking-wide">
              {dept} Department
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border-2 border-white/20 bg-black/60 backdrop-blur-md p-4 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,0.3)]">

            <form onSubmit={handleSubmit} className="grid gap-5 sm:gap-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                  Event Title *
                </label>
                <input
                  name="title"
                  required
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                  Event Description
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                />
              </div>

              {/* Type and Team Size */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Participation Type *
                  </label>
                  <select
                    name="type"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                {form.type === "team" && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                      Team Size *
                    </label>
                    <input
                      name="teamSize"
                      type="number"
                      min="1"
                      onChange={handleChange}
                      placeholder="e.g., 4"
                      className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                )}
              </div>

              {/* UPI and Amount */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    UPI ID *
                  </label>
                  <input
                    name="upiId"
                    required
                    onChange={handleChange}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Registration Fee (₹) *
                  </label>
                  <input
                    name="amount"
                    type="number"
                    required
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                  Event Rules * <span className="text-xs text-white/60 normal-case">(One rule per line)</span>
                </label>
                <textarea
                  name="rules"
                  required
                  onChange={handleChange}
                  placeholder="Enter event rules, one per line"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none font-mono text-sm"
                />
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Registration Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                  Event Poster * <span className="text-xs text-white/60 normal-case">(JPG, PNG)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-semibold hover:file:bg-red-700 file:cursor-pointer focus:outline-none focus:border-red-500/50 transition-all"
                  />
                </div>
                {imageBase64 && (
                  <p className="mt-2 text-sm text-green-400">✓ Image uploaded successfully</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/department/${dept}/dashboard`)}
                  className="flex-1 px-6 py-3 sm:py-4 rounded-lg bg-white/10 border-2 border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 sm:py-4 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white font-bold uppercase tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Adding Event..." : "✅ Add Event"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
       

        /* Custom scrollbar */
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.5);
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.7);
        }
      `}</style>
    </main>
  );
}