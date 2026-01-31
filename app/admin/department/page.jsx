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
    <main
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">

        {/* Fest Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="deadpool-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 uppercase tracking-wider">
            🎉 AVISHKAR 2026
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-semibold">
            Department Admin Portal
          </p>
        </div>

        {/* Department Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.slug}
              href={`/admin/department/${dept.slug}/login`}
              className="group"
            >
              <div className="rounded-xl overflow-hidden border-2 border-white/20 bg-black/40 backdrop-blur-md p-5 sm:p-6 transition-all hover:scale-[1.02] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">

                {/* Department Short Code with gradient */}
                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-br ${dept.color} mb-3 sm:mb-4`}>
                  <h2 className="deadpool-heading text-2xl sm:text-3xl md:text-4xl">
                    {dept.short}
                  </h2>
                </div>

                {/* Department Full Name */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6">
                  {dept.name}
                </h3>

                {/* Login Button */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                  <span className="text-xs sm:text-sm text-white/70 uppercase tracking-wide">
                    Admin Access
                  </span>
                  <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
                    <span className="text-sm sm:text-base font-bold">LOGIN</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-xs sm:text-sm mt-12 sm:mt-16 md:mt-20">
          <p className="uppercase tracking-widest">
            © AVISHKAR Fest | Admin Management System
          </p>
        </div>
      </div>

      {/* Add custom styles for deadpool-heading if not already in globals.css */}
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
      `}</style>
    </main>
  );
}