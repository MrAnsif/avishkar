"use client";

import { useState } from "react";

export default function MainAdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/main/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save JWT token
      localStorage.setItem("mainAdminToken", data.token);

      // 🔀 Redirect to dashboard
      window.location.href = "/admin/main/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.4)] border-2 border-red-500/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-black uppercase mb-2"
              style={{
                fontFamily: 'Impact, sans-serif',
                textShadow: '3px 3px 0px rgba(220,38,38,0.8), -1px -1px 0px rgba(0,0,0,0.8)'
              }}
            >
              🎉 AVISHKAR ADMIN
            </h1>
            <p className="text-sm text-white/70 font-semibold uppercase tracking-wide">
              Main Admin Access Only
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-600/80 backdrop-blur-sm text-white text-sm p-4 rounded-lg mb-6 border border-red-400 font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-black/60 backdrop-blur-sm text-white placeholder-white/40 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-black/60 backdrop-blur-sm text-white placeholder-white/40 font-medium transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-red-700 transition-all disabled:opacity-60 border-2 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:scale-[1.02]"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-white/50 mt-8 font-medium">
            © 2026 College Fest Management System
          </p>
        </div>
      </div>
    </main>
  );
}