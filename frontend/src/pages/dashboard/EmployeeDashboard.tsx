import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'

const EmployeeDashboard = () => {
  const auth = useAuth()

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning, {auth.user?.firstName} 👋</h1>
          <p className="mt-2 text-slate-600">Here's your work summary</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Projects</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-2 text-xs text-slate-500">Active assignments</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Today's Hours</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">8h</p>
                <p className="mt-2 text-xs text-slate-500">Logged today</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Leave Balance</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
                <p className="mt-2 text-xs text-slate-500">Days remaining</p>
              </div>
              <div className="text-4xl">🗓️</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Monthly Hours</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">124h</p>
                <p className="mt-2 text-xs text-slate-500">This month</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Utilization & Active Projects */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Utilization */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">My Utilization</h3>
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-48 w-48">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="8"
                    strokeDasharray="251.2 251.2"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dy="0.3em"
                    className="text-2xl font-bold"
                    fill="#000"
                  >
                    100%
                  </text>
                </svg>
              </div>
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-sm text-slate-600">Allocated</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">100%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Available</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">0%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">Active Projects</h3>
            <div className="space-y-4">
              {[
                { name: 'Project Alpha', dates: '2026-01-01 — 2026-08-31', status: 'In Progress' },
                { name: 'Project Beta', dates: '2026-02-01 — 2026-07-31', status: 'In Progress' },
              ].map((project, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{project.dates}</p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-3/5 bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Timesheets */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Timesheets</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Project</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Hours</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2026-06-09', project: 'Project Alpha', hours: '5h', status: 'Pending' },
                  { date: '2026-06-09', project: 'Project Beta', hours: '3h', status: 'Approved' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">{row.date}</td>
                    <td className="px-4 py-3 text-slate-700">{row.project}</td>
                    <td className="px-4 py-3 text-slate-700">{row.hours}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EmployeeDashboard
