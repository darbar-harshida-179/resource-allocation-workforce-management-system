import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import {
  IoFolderOutline, IoTimeOutline, IoCalendarOutline, IoReloadOutline,
} from 'react-icons/io5'
import { getEmployeeDashboard } from '../../services/dashboardService'
import { getMyTimesheets } from '../../services/timesheetService'

const statusColor = (s: string) =>
  s === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'

const EmployeeDashboard = () => {
  const auth = useAuth()
  const [dashData, setDashData] = useState<any>(null)
  const [timesheets, setTimesheets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, tsRes] = await Promise.all([
          getEmployeeDashboard(),
          getMyTimesheets(),
        ])
        setDashData(dashRes.data)
        setTimesheets((tsRes.data || []).slice(0, 5))
      } catch (err) {
        console.error('Employee dashboard error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalAllocation = dashData?.todaysTasks
    ? dashData.todaysTasks.reduce((sum: number, t: any) => sum + (t.allocationPercentage || 0), 0)
    : 0
  const clampedAllocation = Math.min(totalAllocation, 100)
  const radialData = [{ name: 'Utilization', value: clampedAllocation, fill: '#6366f1' }]

  const leaveBalance = dashData?.leaveBalance
  const totalLeaveRemaining = leaveBalance
    ? (leaveBalance.casual || 0) + (leaveBalance.sick || 0) + (leaveBalance.earned || 0)
    : 0

  // const todayStr = new Date().toDateString()
  // const loggedToday = timesheets
  //   .filter((t: any) => new Date(t.date).toDateString() === todayStr)
  //   .reduce((sum: number, t: any) => sum + (t.hours || 0), 0)

  const statItems = [
    { label: 'Assigned Projects', value: dashData?.assignedProjects ?? 0, sub: 'Active assignments', icon: <IoFolderOutline size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Leave Balance', value: totalLeaveRemaining, sub: 'Days remaining', icon: <IoCalendarOutline size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'Submitted Timesheets', value: dashData?.submittedTimesheets ?? 0, sub: 'Total submitted', icon: <IoTimeOutline size={24} className="text-indigo-500" />, bg: 'bg-indigo-50' },
  ]

  const activeProjects: any[] = (dashData?.todaysTasks || []).filter((t: any) => t.project?.status !== 'completed')

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Good morning, {auth.user?.firstName}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your work summary</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {statItems.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
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
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-2 text-base font-semibold text-slate-900">My Utilization</h3>
            <div className="flex flex-col items-center">
              <div className="relative h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={90} endAngle={-270} data={radialData}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#e2e8f0' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-indigo-600">{clampedAllocation}%</p>
                  <p className="text-xs text-slate-500">Allocated</p>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{clampedAllocation}%</p>
                  <p className="text-xs text-slate-500">Allocated</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{Math.max(0, 100 - clampedAllocation)}%</p>
                  <p className="text-xs text-slate-500">Available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Active Projects</h3>
            <div className="space-y-4">
              {activeProjects.length === 0 ? (
                <p className="text-sm text-slate-400">No active projects assigned.</p>
              ) : (
                activeProjects.map((t: any, i: number) => (
                  <div key={t._id || i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">{t.project?.projectName ?? 'Project'}</h4>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {t.allocationPercentage}% allocated
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {t.startDate ? new Date(t.startDate).toLocaleDateString() : ''} — {t.endDate ? new Date(t.endDate).toLocaleDateString() : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Timesheets */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Timesheets</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['Date', 'Project', 'Hours', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timesheets.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-400">No timesheets submitted yet.</td></tr>
                ) : (
                  timesheets.map((r: any, i: number) => (
                    <tr key={r._id || i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-600">{r.project?.projectName ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{r.hours}h</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default EmployeeDashboard
