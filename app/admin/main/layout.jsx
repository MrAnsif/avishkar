"use client";

export default function MainAdminLayout({ children }) {
  const logout = () => {
    localStorage.removeItem("mainAdminToken");
    window.location.href = "/admin/main/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">🎉 Avishkar – Main Admin</h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
