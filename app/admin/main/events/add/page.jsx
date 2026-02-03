"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("individual");
  const [teamSize, setTeamSize] = useState(1);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState(0);
  const [rules, setRules] = useState(["Attendance required"]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!imageFile) throw new Error("Event image is required");

      const imageBase64 = await toBase64(imageFile);

      const token = localStorage.getItem("mainAdminToken");

      const res = await fetch("/api/admin/main/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          type,
          teamSize: type === "team" ? Number(teamSize) : 1,
          upiId,
          amount: Number(amount),
          rules,
          imageBase64,
          startTime,
          endTime,
          registrationDeadline,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error adding event");

      alert("Event added successfully!");
      router.push("/admin/main/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/admin/main/dashboard")}
            className="text-white/70 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="deadpool-heading text-3xl sm:text-4xl md:text-5xl uppercase mb-2">
            ➕ Add New Event
          </h1>
          <div className="inline-block px-4 py-2 bg-red-600/80 rounded-lg">
            <p className="text-sm sm:text-base font-bold uppercase tracking-wide">
              Main Admin
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border-2 border-white/20 bg-black/60 backdrop-blur-md p-4 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,0.3)]">

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-600/80 backdrop-blur-sm border border-red-400 text-white font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div className="grid gap-5 sm:gap-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  >
                    <option value="individual" className="bg-black">Individual</option>
                    <option value="team" className="bg-black">Team</option>
                  </select>
                </div>

                {type === "team" && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                      Team Size *
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
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
                    GPay Number *
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="yourGpayNumber"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Registration Fee (₹) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
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
                  value={rules.join("\n")}
                  onChange={(e) =>
                    setRules(e.target.value.split("\n").filter((r) => r.trim() !== ""))
                  }
                  required
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
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white/90 uppercase tracking-wide">
                    Registration Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    required
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
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-semibold hover:file:bg-red-700 file:cursor-pointer focus:outline-none focus:border-red-500/50 transition-all"
                  />
                </div>
                {imageFile && (
                  <p className="mt-2 text-sm text-green-400">✓ Image uploaded successfully</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/main/dashboard")}
                  className="flex-1 px-6 py-3 sm:py-4 rounded-lg bg-white/10 border-2 border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  disabled={loading}
                  className="flex-1 px-6 py-3 sm:py-4 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white font-bold uppercase tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Adding Event..." : "✅ Add Event"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .deadpool-heading {
          font-family: 'Impact', 'Arial Black', sans-serif;
          text-shadow: 
            3px 3px 0 #000,
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000,
            2px 2px 0 #dc2626,
            4px 4px 8px rgba(0,0,0,0.8);
          color: #fff;
          letter-spacing: 0.05em;
        }

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