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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">
          ➕ Add Event ({dept.toUpperCase()})
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-5">

          {/* Title */}
          <div>
            <label className="label">Event Title</label>
            <input name="title" required onChange={handleChange} className="input" />
          </div>

          {/* Description */}
          <div>
            <label className="label">Event Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="input h-24"
            />
          </div>

          {/* Type */}
          <div>
            <label className="label">Participation Type</label>
            <select name="type" onChange={handleChange} className="input">
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>

          {/* Team Size */}
          {form.type === "team" && (
            <div>
              <label className="label">Team Size</label>
              <input
                name="teamSize"
                type="number"
                min="1"
                onChange={handleChange}
                className="input"
              />
            </div>
          )}

          {/* UPI */}
          <div>
            <label className="label">UPI ID</label>
            <input name="upiId" required onChange={handleChange} className="input" />
          </div>

          {/* Amount */}
          <div>
            <label className="label">Registration Fee (₹)</label>
            <input
              name="amount"
              type="number"
              required
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="label">
              Event Rules 
            </label>
            <textarea
              name="rules"
              required
              onChange={handleChange}
              placeholder="enter rules"
              className="input h-28"
            />
          </div>

          {/* Dates */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                required
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                required
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Registration Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                required
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="label">Event Poster</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageUpload}
              className="input"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
        }
        .label {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 4px;
          display: block;
        }
      `}</style>
    </div>
  );
}
