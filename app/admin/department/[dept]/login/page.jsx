"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DepartmentLoginPage() {
  const router = useRouter();
  const { dept } = useParams(); // cse, ece, etc.

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 🔐 Store token & department
      localStorage.setItem("deptAdminToken", data.token);
      localStorage.setItem("department", data.department);

      // 🚀 Redirect to department dashboard
      router.push(`/admin/department/${data.department}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center">
          🎉 AVISHKAR 2026
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-6 capitalize">
          {dept} Department Admin Login
        </p>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          Department Admin Access Only
        </p>
      </div>
    </div>
  );
}
