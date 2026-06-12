import MainLayout from '../../components/layout/MainLayout'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  IoPeopleOutline, IoFolderOutline, IoTimeOutline, IoCalendarOutline,
  IoDocumentTextOutline, IoCheckmarkCircleOutline, IoAddCircleOutline, IoAlertCircleOutline,
} from 'react-icons/io5'

const utilizationData = [
  { month: 'Jan', value: 68 },
  { month: 'Feb', value: 74 },
  { month: 'Mar', value: 82 },
  { month: 'Apr', value: 79 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 91 },
]

const deptData = [
  { name: 'Engineering', value: 12 },
  { name: 'Design', value: 5 },
  { name: 'QA', value: 4 },
  { name: 'Backend', value: 7 },
  { name: 'Other', value: 3 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const stats = [
  { label: 'Total Employees', value: '31', sub: '+3 this month', icon: <IoPeopleOutline size={26} className="text-indigo-500" />, bg: 'bg-indigo-50' },
  { label: 'Active Projects', value: '2', sub: '4 total', icon: <IoFolderOutline size={26} className="text-blue-500" />, bg: 'bg-blue-50' },
  { label: 'Allocated Resources', value: '5', sub: '16% unallocated', icon: <IoTimeOutline size={26} className="text-amber-500" />, bg: 'bg-amber-50' },
  { label: 'On Leave Today', value: '2', sub: 'Approved leaves', icon: <IoCalendarOutline size={26} className="text-green-500" />, bg: 'bg-green-50' },
]

const projectStatus = [
  { label: 'In Progress', count: 2, color: 'bg-blue-500' },
  { label: 'Planning', count: 1, color: 'bg-purple-500' },
  { label: 'Completed', count: 1, color: 'bg-green-500' },
  { label: 'On Hold', count: 0, color: 'bg-red-500' },
]

const activity = [
  { text: 'Rohan Mehta submitted timesheet', time: '2h ago', icon: <IoDocumentTextOutline size={16} className="text-indigo-500" /> },
  { text: "Ananya Patel's leave approved", time: '4h ago', icon: <IoCheckmarkCircleOutline size={16} className="text-green-500" /> },
  { text: 'Project Delta allocation created', time: '6h ago', icon: <IoAddCircleOutline size={16} className="text-blue-500" /> },
  { text: 'Vikram Singh applied for leave', time: '1d ago', icon: <IoCalendarOutline size={16} className="text-amber-500" /> },
  { text: 'Project Gamma marked complete', time: '2d ago', icon: <IoCheckmarkCircleOutline size={16} className="text-green-500" /> },
]

const AdminDashboard = () => (
  <MainLayout>
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Organization overview — June 2026</p>
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
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Monthly Utilization Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilizationData} barSize={32}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, 'Utilization']} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Project Status</h3>
          <div className="space-y-3">
            {projectStatus.map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                  <span className="text-sm text-slate-700">{p.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{a.icon}</div>
                  <p className="text-sm text-slate-700">{a.text}</p>
                </div>
                <p className="shrink-0 text-xs text-slate-400 ml-2">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
)

export default AdminDashboard
