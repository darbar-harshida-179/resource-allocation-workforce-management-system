import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  IoPeopleOutline, IoFolderOutline, IoTimeOutline, IoCalendarOutline,
  IoReloadOutline,
} from 'react-icons/io5'
import { getAdminDashboard } from '../../services/dashboardService'
import { getProjects } from '../../services/projectService'
import { getTimesheets } from '../../services/timesheetService'
import { getAllEmployees } from '../../services/employeeService'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#f43f5e']

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    resourcesAllocated: 0,
    employeesOnLeave: 0,
  })
  const [projectStatusData, setProjectStatusData] = useState<{ name: string; value: number }[]>([])
  const [departmentData, setDepartmentData] = useState<{ name: string; value: number }[]>([])
  const [recentActivity, setRecentActivity] = useState<{ text: string; hours: number; time: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dashRes, projRes, tsRes, empRes] = await Promise.all([
          getAdminDashboard(),
          getProjects(),
          getTimesheets(),
          getAllEmployees(),
        ])

        setStats({
          totalEmployees: dashRes.data.totalEmployees,
          activeProjects: dashRes.data.activeProjects,
          resourcesAllocated: dashRes.data.resourcesAllocated,
          employeesOnLeave: dashRes.data.employeesOnLeave,
        })

        // Project status breakdown
        const projects: any[] = projRes.data || []
        const statusMap: Record<string, number> = {}
        projects.forEach((p: any) => {
          const label = p.status === 'in-progress' ? 'In Progress'
            : p.status === 'planning' ? 'Planning'
            : p.status === 'completed' ? 'Completed'
            : 'On Hold'
          statusMap[label] = (statusMap[label] || 0) + 1
        })

        setProjectStatusData([
          { name: 'In Progress', value: statusMap['In Progress'] || 0 },
          { name: 'Planning', value: statusMap['Planning'] || 0 },
          { name: 'Completed', value: statusMap['Completed'] || 0 },
          { name: 'On Hold', value: statusMap['On Hold'] || 0 },
        ].filter(item => item.value > 0))

        // Department distribution breakdown
        const employees: any[] = empRes.data || []
        const deptMap: Record<string, number> = {}
        employees.forEach((e: any) => {
          const dept = e.department || 'Unassigned'
          deptMap[dept] = (deptMap[dept] || 0) + 1
        })
        const formattedDepts = Object.keys(deptMap).map(key => ({
          name: key,
          value: deptMap[key]
        }))
        setDepartmentData(formattedDepts)

        // Recent activity from timesheets
        const timesheets: any[] = tsRes.data || []
        const activity = timesheets.slice(0, 5).map((ts: any) => ({
          text: `${ts.employee?.firstName ?? ''} ${ts.employee?.lastName ?? ''} logged ${ts.hours}h on ${ts.project?.projectName ?? 'Project'}`,
          hours: ts.hours || 0,
          time: new Date(ts.createdAt || ts.date).toLocaleDateString(),
        }))
        setRecentActivity(activity)
      } catch (err) {
        console.error('Dashboard load error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Employees', value: stats.totalEmployees, sub: 'All employees', icon: <IoPeopleOutline size={26} className="text-indigo-500" />, bg: 'bg-indigo-50' },
    { label: 'Active Projects', value: stats.activeProjects, sub: 'In progress', icon: <IoFolderOutline size={26} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Allocated Resources', value: stats.resourcesAllocated, sub: 'Current allocations', icon: <IoTimeOutline size={26} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'On Leave Today', value: stats.employeesOnLeave, sub: 'Approved leaves', icon: <IoCalendarOutline size={26} className="text-green-500" />, bg: 'bg-green-50' },
  ]

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
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Organization overview — {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
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

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Distribution */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Department Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Employee(s)`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Project Status Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {projectStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Project(s)`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Timesheet Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400">No recent activity yet.</p>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-700 font-medium">{a.text}</p>
                    <p className="shrink-0 text-xs text-slate-400 ml-2">{a.time}</p>
                  </div>
                  <div className="mt-2 w-full max-w-xs bg-slate-100 rounded-full h-1">
                    <div
                      className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (a.hours / 8) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default AdminDashboard

