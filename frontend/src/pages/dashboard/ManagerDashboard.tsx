import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'

const ManagerDashboard = () => {
  const auth = useAuth()

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {auth.user?.firstName}</h1>
          <p className="mt-2 text-slate-600">Here's your project overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">My Projects</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-2 text-xs text-slate-500">Active</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Assigned Resources</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
                <p className="mt-2 text-xs text-slate-500">Across projects</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Timesheets</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
                <p className="mt-2 text-xs text-slate-500">Awaiting review</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Leave Requests</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-2 text-xs text-slate-500">Pending approval</p>
              </div>
              <div className="text-4xl">🗓️</div>
            </div>
          </div>
        </div>

        {/* My Projects + Resource Utilization side by side */}
        <div className="grid gap-6 lg:grid-cols-2">

        {/* My Projects */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">My Projects</h3>
          <div className="space-y-4">
            {[
              { name: 'Project Alpha', status: 'In Progress', progress: 60, dates: '2026-01-01 — 2026-08-31' },
              { name: 'Project Beta', status: 'In Progress', progress: 40, dates: '2026-02-01 — 2026-07-31' },
              { name: 'Project Gamma', status: 'Completed', progress: 100, dates: '2025-10-01 — 2026-03-31' },
              { name: 'Project Delta', status: 'Planning', progress: 0, dates: '2026-04-01 — 2026-12-31' },
            ].map((project, idx) => (
              <div key={idx} className="border-b border-slate-200 pb-4 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{project.name}</h4>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : project.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{project.dates}</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Resource Utilization</h3>
          <div className="space-y-3">
            {[
              { name: 'Rohan Mehta', department: 'Engineering', utilization: 100 },
              { name: 'Ananya Patel', department: 'Design', utilization: 80 },
              { name: 'Vikram Singh', department: 'Engineering', utilization: 50 },
              { name: 'Neha Gupta', department: 'QA', utilization: 0 },
            ].map((resource, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{resource.name}</p>
                  <p className="text-xs text-slate-500">{resource.department}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full transition-all ${
                        resource.utilization === 100
                          ? 'bg-red-500'
                          : resource.utilization >= 50
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <p className="text-sm font-semibold text-slate-900">{resource.utilization}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>{/* end grid */}

        {/* Pending Approvals */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Leave Requests */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Leave Requests</h3>
            <div className="space-y-3">
              {[
                { name: 'Rohan Mehta', dates: 'casual — 2026-06-15', action: 'approve' },
                { name: 'Vikram Singh', dates: 'earned — 2026-07-01', action: 'approve' },
              ].map((request, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{request.name}</p>
                    <p className="text-xs text-slate-600">{request.dates}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded text-green-600 hover:bg-green-100">✓</button>
                    <button className="rounded text-red-600 hover:bg-red-100">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timesheets */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Timesheets</h3>
            <div className="space-y-3">
              {[
                { name: 'Rohan Mehta', project: 'Project Alpha — 5h', action: 'approve' },
                { name: 'Ananya Patel', project: 'Project Alpha — 8h', action: 'approve' },
              ].map((timesheet, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{timesheet.name}</p>
                    <p className="text-xs text-slate-600">{timesheet.project}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded text-green-600 hover:bg-green-100">✓</button>
                    <button className="rounded text-red-600 hover:bg-red-100">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ManagerDashboard
