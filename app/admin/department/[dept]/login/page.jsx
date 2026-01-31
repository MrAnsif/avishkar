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
    <main
      className="relative min-h-screen text-white bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">

        {/* Login Card */}
        <div className="rounded-xl overflow-hidden border-2 border-white/20 bg-black/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_40px_rgba(220,38,38,0.3)]">

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="admin-heading text-3xl sm:text-4xl md:text-5xl mb-3 uppercase">
              🎉 AVISHKAR 2026
            </h1>
            <div className="inline-block px-4 py-2 bg-red-600/80 rounded-lg mb-2">
              <p className="text-base sm:text-lg font-bold uppercase tracking-wide">
                {dept} Department
              </p>
            </div>
            <p className="text-sm text-white/70 uppercase tracking-widest">
              Admin Access Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center font-semibold">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg uppercase tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Logging in..." : "🔓 Access Dashboard"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-center text-white/50 uppercase tracking-widest">
              🔒 Authorized Personnel Only
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/admin/department")}
            className="text-sm text-white/70 hover:text-white transition-colors underline"
          >
            ← Back to Departments
          </button>
        </div>
      </div>
    </main>
  );
}