'use client'

import Link from 'next/link'

const departments = [
  { name: 'Computer Science', slug: 'cse' },
  { name: 'Mechanical', slug: 'mechanical' },
  { name: 'Civil', slug: 'civil' },
  { name: 'Electronics', slug: 'ece' },
  { name: 'Electrical', slug: 'eee' },
  { name: 'MCA', slug: 'mca' },
]

export default function DepartmentEventsPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
        {/* HEADING */}
        <h1 className="deadpool-heading text-4xl md:text-5xl mb-12 text-center">
          DEPARTMENTS
        </h1>

        {/* DEPARTMENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.slug}
              href={`/events/department/${dept.slug}`}
              className="
                group
                border border-white/20
                rounded-2xl
                p-10
                bg-black/40
                backdrop-blur-md
                text-center
                transition-all
                hover:border-red-500
                hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]
                active:scale-95
              "
            >
              <h2 className="deadpool-heading text-3xl group-hover:text-red-400 transition">
                {dept.name}
              </h2>

              <p className="mt-3 text-white/70 text-sm">
                View {dept.name} events →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}