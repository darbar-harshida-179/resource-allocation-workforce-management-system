import MainLayout from '../../components/layout/MainLayout'

const AdminDashboard = () => {

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Organization overview — June 2026</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Employees</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">31</p>
                <p className="mt-2 text-xs text-slate-500">+3 this month</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Projects</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-2 text-xs text-slate-500">4 total</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Allocated Resources</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">5</p>
                <p className="mt-2 text-xs text-slate-500">16% unallocated</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">On Leave Today</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-2 text-xs text-slate-500">Approved leaves</p>
              </div>
              <div className="text-4xl">🗓️</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Utilization Trend */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Monthly Utilization Trend</h3>
            <div className="flex items-end justify-around" style={{ height: '200px' }}>
              {[68, 74, 82, 79, 88, 91].map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 rounded-lg bg-indigo-600"
                    style={{ height: `${(value / 100) * 150}px` }}
                  />
                  <p className="text-xs text-slate-600">{value}</p>
                  <p className="text-xs font-medium text-slate-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Department Distribution</h3>
            <div className="flex items-center justify-around">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="120 200" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="60 200" strokeDashoffset="-120" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="40 200" strokeDashoffset="-180" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="30 200" strokeDashoffset="-220" />
                  <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-lg font-bold" fill="#000">31</text>
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-indigo-600" />
                  <span className="text-sm text-slate-700">Engineering - 12</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-600" />
                  <span className="text-sm text-slate-700">Design - 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-pink-600" />
                  <span className="text-sm text-slate-700">QA - 4</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-600" />
                  <span className="text-sm text-slate-700">Backend - 7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Project Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-600" />
                <span className="text-sm text-slate-700">In Progress</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="text-sm text-slate-700">Planning</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-600" />
                <span className="text-sm text-slate-700">Completed</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-600" />
                <span className="text-sm text-slate-700">On Hold</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">0</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { activity: 'Rohan Mehta submitted timesheet', time: '2h ago', icon: '📋' },
              { activity: "Ananya Patel's leave approved", time: '4h ago', icon: '✅' },
              { activity: 'Project Delta allocation created', time: '6h ago', icon: '📁' },
              { activity: 'Vikram Singh applied for leave', time: '1d ago', icon: '🗓️' },
              { activity: 'Project Gamma marked complete', time: '2d ago', icon: '✅' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <p className="text-sm text-slate-700">{item.activity}</p>
                </div>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default AdminDashboard
