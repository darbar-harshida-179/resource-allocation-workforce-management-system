import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import {
  IoFolderOutline, IoTimeOutline, IoCalendarOutline, IoBarChartOutline,
} from 'react-icons/io5'

const statusColor = (s: string) =>
  s === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'

const radialData = [{ name: 'Utilization', value: 100, fill: '#6366f1' }]

const EmployeeDashboard = () => {
  const auth = useAuth()

  const stats = [
    { label: 'Current Projects', value: '2', sub: 'Active assignments', icon: <IoFolderOutline size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: "Today's Hours", value: '8h', sub: 'Logged today', icon: <IoTimeOutline size={24} className="text-indigo-500" />, bg: 'bg-indigo-50' },
    { label: 'Leave Balance', value: '12', sub: 'Days remaining', icon: <IoCalendarOutline size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'Monthly Hours', value: '124h', sub: 'This month', icon: <IoBarChartOutline size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Good morning, {auth.user?.firstName}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your work summary</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Utilization Chart + Active Projects */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-base font-semibold text-slate-900">My Utilization</h3>
            <div className="flex flex-col items-center">
              <div className="relative h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={90} endAngle={-270} data={radialData}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#e2e8f0' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-indigo-600">100%</p>
                  <p className="text-xs text-slate-500">Allocated</p>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Allocated</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">0%</p>
                  <p className="text-xs text-slate-500">Available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Active Projects</h3>
            <div className="space-y-4">
              {[
                { name: 'Project Alpha', dates: '2026-01-01 — 2026-08-31', progress: 60 },
                { name: 'Project Beta', dates: '2026-02-01 — 2026-07-31', progress: 40 },
              ].map((p, i) => (
                <div key={i} className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">In Progress</span>
                  </div>
                  <p className="text-xs text-slate-400">{p.dates}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-indigo-600" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Timesheets */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Timesheets</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  {['Date', 'Project', 'Hours', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2026-06-09', project: 'Project Alpha', hours: '5h', status: 'Pending' },
                  { date: '2026-06-09', project: 'Project Beta', hours: '3h', status: 'Approved' },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">{r.date}</td>
                    <td className="px-4 py-3 text-slate-600">{r.project}</td>
                    <td className="px-4 py-3 text-slate-600">{r.hours}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span>
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
