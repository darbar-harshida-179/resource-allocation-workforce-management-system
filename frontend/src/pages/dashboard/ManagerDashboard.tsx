import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  IoFolderOutline, IoPeopleOutline, IoDocumentTextOutline, IoCalendarOutline,
  IoCheckmarkOutline, IoCloseOutline,
} from 'react-icons/io5'
import { useState } from 'react'

const stats = [
  { label: 'My Projects', value: '2', sub: 'Active', icon: <IoFolderOutline size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
  { label: 'Assigned Resources', value: '3', sub: 'Across projects', icon: <IoPeopleOutline size={24} className="text-indigo-500" />, bg: 'bg-indigo-50' },
  { label: 'Pending Timesheets', value: '3', sub: 'Awaiting review', icon: <IoDocumentTextOutline size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
  { label: 'Leave Requests', value: '2', sub: 'Pending approval', icon: <IoCalendarOutline size={24} className="text-green-500" />, bg: 'bg-green-50' },
]

const projects = [
  { name: 'Project Alpha', status: 'In Progress', dates: '2026-01-01 — 2026-08-31' },
  { name: 'Project Beta', status: 'In Progress', dates: '2026-02-01 — 2026-07-31' },
  { name: 'Project Gamma', status: 'Completed', dates: '2025-10-01 — 2026-03-31' },
  { name: 'Project Delta', status: 'Planning', dates: '2026-04-01 — 2026-12-31' },
]

const utilizationData = [
  { name: 'Rohan Mehta', utilization: 100 },
  { name: 'Ananya Patel', utilization: 80 },
  { name: 'Vikram Singh', utilization: 50 },
  { name: 'Neha Gupta', utilization: 0 },
]

const barColor = (v: number) => v === 100 ? '#ef4444' : v >= 50 ? '#f59e0b' : '#22c55e'

const statusColor = (s: string) =>
  s === 'In Progress' ? 'bg-blue-100 text-blue-700' : s === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'

const ManagerDashboard = () => {
  const auth = useAuth()
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Rohan Mehta', info: 'Casual — 2026-06-15', status: 'pending' },
    { id: 2, name: 'Vikram Singh', info: 'Earned — 2026-07-01', status: 'pending' },
  ])
  const [timesheets, setTimesheets] = useState([
    { id: 1, name: 'Rohan Mehta', info: 'Project Alpha — 5h', status: 'pending' },
    { id: 2, name: 'Ananya Patel', info: 'Project Alpha — 8h', status: 'pending' },
  ])

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {auth.user?.firstName}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your project overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* My Projects + Resource Utilization Chart */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">My Projects</h3>
            <div className="space-y-3">
              {projects.map((p, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.dates}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(p.status)}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Resource Utilization</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={utilizationData} layout="vertical" barSize={14} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip formatter={(v) => [`${v}%`, 'Utilization']} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="utilization" radius={[0, 6, 6, 0]}>
                  {utilizationData.map((d, i) => <Cell key={i} fill={barColor(d.utilization)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Leave Requests</h3>
            <div className="space-y-3">
              {leaves.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.info}</p>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => setLeaves(p => p.map(x => x.id === r.id ? { ...x, status: 'approved' } : x))}
                        className="rounded-lg p-1.5 text-green-600 hover:bg-green-100"><IoCheckmarkOutline size={17} /></button>
                      <button onClick={() => setLeaves(p => p.map(x => x.id === r.id ? { ...x, status: 'rejected' } : x))}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-100"><IoCloseOutline size={17} /></button>
                    </div>
                  )}
                  {r.status !== 'pending' && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Timesheets</h3>
            <div className="space-y-3">
              {timesheets.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.info}</p>
                  </div>
                  {t.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => setTimesheets(p => p.map(x => x.id === t.id ? { ...x, status: 'approved' } : x))}
                        className="rounded-lg p-1.5 text-green-600 hover:bg-green-100"><IoCheckmarkOutline size={17} /></button>
                      <button onClick={() => setTimesheets(p => p.map(x => x.id === t.id ? { ...x, status: 'rejected' } : x))}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-100"><IoCloseOutline size={17} /></button>
                    </div>
                  )}
                  {t.status !== 'pending' && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  )}
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
