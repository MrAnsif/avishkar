"use client";

import Link from "next/link";

const departments = [
  { name: "Computer Science", short: "CSE", slug: "cse", color: "from-blue-500 to-indigo-600" },
  { name: "Electronics & Communication", short: "ECE", slug: "ece", color: "from-purple-500 to-pink-600" },
  { name: "Electrical & Electronics", short: "EEE", slug: "eee", color: "from-yellow-500 to-orange-600" },
  { name: "Mechanical Engineering", short: "MECH", slug: "mechanical", color: "from-red-500 to-rose-600" },
  { name: "Civil Engineering", short: "CIVIL", slug: "civil", color: "from-green-500 to-emerald-600" },
  { name: "Master of Computer Applications", short: "MCA", slug: "mca", color: "from-cyan-500 to-sky-600" },
];

export default function DepartmentAdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 p-4">
      
      {/* Fest Header */}
      <div className="text-center text-white mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          🎉 AVISHKAR 2026
        </h1>
        <p className="mt-2 text-sm md:text-base opacity-90">
          Department Admin Portal
        </p>
      </div>

      {/* Department Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Link
            key={dept.slug}
            href={`/admin/department/${dept.slug}/login`}
            className="group"
          >
            <div
              className={`h-40 rounded-2xl shadow-lg bg-gradient-to-br ${dept.color}
              text-white p-6 flex flex-col justify-between
              transform transition hover:scale-[1.03] hover:shadow-2xl`}
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {dept.short}
                </h2>
                <p className="mt-1 text-sm opacity-90">
                  {dept.name}
                </p>
              </div>

              <div className="text-right text-sm font-medium opacity-90 group-hover:opacity-100">
                Login →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-white text-xs mt-10 opacity-70">
        © AVISHKAR Fest | Admin Management System
      </div>
    </div>
  );
}
