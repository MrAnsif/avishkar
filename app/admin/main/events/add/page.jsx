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
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">➕ Add New Event</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>

          {type === "team" && (
            <input
              type="number"
              min="2"
              placeholder="Team Size"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}

          <input
            type="text"
            placeholder="UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Rules (one per line)"
            value={rules.join("\n")}
            onChange={(e) =>
              setRules(e.target.value.split("\n").filter((r) => r.trim() !== ""))
            }
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <label className="block">
            Event Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full mt-1"
              required
            />
          </label>

          <label className="block">
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </label>

          <label className="block">
            End Time:
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </label>

          <label className="block">
            Registration Deadline:
            <input
              type="datetime-local"
              value={registrationDeadline}
              onChange={(e) => setRegistrationDeadline(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
