"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { dept, eventId } = params;

  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "individual",
    teamSize: 1,
    upiId: "",
    amount: "",
    rules: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
  });

  // ================= FETCH EVENT =================
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      const token = localStorage.getItem("deptAdminToken");
      if (!token) {
        router.push(`/admin/department/${dept}/login`);
        return;
      }

      try {
        // ✅ Fetch using path param
        const res = await fetch(`/api/admin/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log('asdfasdfasfas',data)

        if (!res.ok) {
          alert(data.message || "Failed to load event");
          return;
        }

        setForm({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "individual",
          teamSize: data.teamSize || 1,
          upiId: data.upiId || "",
          amount: data.amount || "",
          rules: (data.rules || []).join("\n"),
          startTime: data.startTime?.slice(0, 16) || "",
          endTime: data.endTime?.slice(0, 16) || "",
          registrationDeadline: data.registrationDeadline?.slice(0, 16) || "",
        });
      } catch (err) {
        console.error(err);
        alert("Server error while fetching event");
      }
    };

    fetchEvent();
  }, [dept, eventId, router]);

  // ================= IMAGE UPLOAD =================
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

  // ================= UPDATE EVENT =================
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          title: form.title,
          description: form.description,
          type: form.type,
          teamSize: form.type === "team" ? Number(form.teamSize) : 1,
          upiId: form.upiId,
          amount: Number(form.amount),
          rules: form.rules.split("\n").filter(Boolean),
          startTime: form.startTime,
          endTime: form.endTime,
          registrationDeadline: form.registrationDeadline,
          ...(imageBase64 && { imageBase64 }), // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("✅ Event updated successfully");
      router.push(`/admin/department/${dept}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Server error during update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">
          ✏️ Edit Event ({dept?.toUpperCase()})
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Title */}
          <div>
            <label className="label">Event Title</label>
            <input
              name="title"
              value={form.title}
              required
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Event Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input h-24"
            />
          </div>

          {/* Participation Type */}
          <div>
            <label className="label">Participation Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input"
            >
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
                value={form.teamSize}
                onChange={handleChange}
                className="input"
              />
            </div>
          )}

          {/* UPI ID */}
          <div>
            <label className="label">UPI ID</label>
            <input
              name="upiId"
              value={form.upiId}
              required
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="label">Registration Fee (₹)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              required
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="label">Event Rules</label>
            <textarea
              name="rules"
              value={form.rules}
              required
              onChange={handleChange}
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
                value={form.startTime}
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
                value={form.endTime}
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
                value={form.registrationDeadline}
                required
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="label">Change Event Poster (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 0.6rem;
          border-radius: 0.5rem;
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
