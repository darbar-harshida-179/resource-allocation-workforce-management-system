import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import {
  IoFolderOutline, IoPeopleOutline, IoDocumentTextOutline, IoCalendarOutline,
  IoCheckmarkOutline, IoCloseOutline, IoReloadOutline,
} from 'react-icons/io5'
import { getManagerDashboard } from '../../services/dashboardService'
import { getProjects } from '../../services/projectService'
import { getLeaves, approveLeave, rejectLeave } from '../../services/leaveService'
import { getTimesheets, approveTimesheet, rejectTimesheet } from '../../services/timesheetService'
import { getAllocations } from '../../services/allocationService'
import { toast } from 'react-toastify'

const barColor = (v: number) => v === 100 ? 'bg-red-500' : v >= 50 ? 'bg-amber-500' : 'bg-green-500'

const ManagerDashboard = () => {
  const auth = useAuth()
  const [dashData, setDashData] = useState({ myProjects: 0, teamMembers: 0, pendingTimesheets: 0, pendingLeaves: 0 })
  const [leaves, setLeaves] = useState<any[]>([])
  const [timesheets, setTimesheets] = useState<any[]>([])
  const [utilizationData, setUtilizationData] = useState<{ employeeName: string; department: string; utilization: number }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [dashRes, projRes, leaveRes, tsRes, allocRes] = await Promise.all([
        getManagerDashboard(),
        getProjects(),
        getLeaves(),
        getTimesheets(),
        getAllocations(),
      ])

      setDashData({
        myProjects: dashRes.data.myProjects,
        teamMembers: dashRes.data.teamMembers,
        pendingTimesheets: dashRes.data.pendingTimesheets,
        pendingLeaves: dashRes.data.pendingLeaves,
      })

      // Filter manager's own projects
      const allProjects: any[] = projRes.data || []
      allProjects.filter(
        (p: any) => p.manager?._id === auth.user?._id || p.createdBy?._id === auth.user?._id
      )

      // Only pending leaves
      const allLeaves: any[] = leaveRes.data || []
      setLeaves(allLeaves.filter((l: any) => l.status === 'pending').slice(0, 5))

      // Only pending timesheets
      const allTs: any[] = tsRes.data || []
      setTimesheets(allTs.filter((t: any) => t.status === 'pending').slice(0, 5))

      // Compute resource utilization metrics from active allocations
      const allocations: any[] = allocRes.data || []
      const empMap: Record<string, { name: string; dept: string; util: number }> = {}
      
      allocations.forEach((alloc: any) => {
        if (!alloc.employee) return
        const empId = alloc.employee._id
        const name = `${alloc.employee.firstName} ${alloc.employee.lastName}`
        const dept = alloc.employee.department || 'Engineering'
        if (!empMap[empId]) {
          empMap[empId] = { name, dept, util: 0 }
        }
        empMap[empId].util += alloc.allocationPercentage || 0
      })

      const formattedUtils = Object.values(empMap).map(item => ({
        employeeName: item.name,
        department: item.dept,
        utilization: Math.min(item.util, 100),
      })).sort((a, b) => b.utilization - a.utilization)

      setUtilizationData(formattedUtils.slice(0, 5))
    } catch (err) {
      console.error('Manager dashboard error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleApproveLeave = async (id: string) => {
    try {
      await approveLeave(id)
      toast.success('Leave approved successfully')
      setLeaves(prev => prev.filter(l => l._id !== id))
      setDashData(prev => ({ ...prev, pendingLeaves: Math.max(0, prev.pendingLeaves - 1) }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve leave')
    }
  }

  const handleRejectLeave = async (id: string) => {
    try {
      await rejectLeave(id)
      toast.success('Leave rejected successfully')
      setLeaves(prev => prev.filter(l => l._id !== id))
      setDashData(prev => ({ ...prev, pendingLeaves: Math.max(0, prev.pendingLeaves - 1) }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject leave')
    }
  }

  const handleApproveTs = async (id: string) => {
    try {
      await approveTimesheet(id)
      toast.success('Timesheet approved successfully')
      setTimesheets(prev => prev.filter(t => t._id !== id))
      setDashData(prev => ({ ...prev, pendingTimesheets: Math.max(0, prev.pendingTimesheets - 1) }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve timesheet')
    }
  }

  const handleRejectTs = async (id: string) => {
    try {
      await rejectTimesheet(id)
      toast.success('Timesheet rejected successfully')
      setTimesheets(prev => prev.filter(t => t._id !== id))
      setDashData(prev => ({ ...prev, pendingTimesheets: Math.max(0, prev.pendingTimesheets - 1) }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject timesheet')
    }
  }

  const statCards = [
    { label: 'My Projects', value: dashData.myProjects, sub: 'Active', icon: <IoFolderOutline size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Team Members', value: dashData.teamMembers, sub: 'Across projects', icon: <IoPeopleOutline size={24} className="text-indigo-500" />, bg: 'bg-indigo-50' },
    { label: 'Pending Timesheets', value: dashData.pendingTimesheets, sub: 'Awaiting review', icon: <IoDocumentTextOutline size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Pending Leaves', value: dashData.pendingLeaves, sub: 'Pending approval', icon: <IoCalendarOutline size={24} className="text-green-500" />, bg: 'bg-green-50' },
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
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {auth.user?.firstName}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your project overview</p>
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
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Resource Utilization progress bar */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Resource Utilization</h3>
          <div className="space-y-4">
            {utilizationData.length === 0 ? (
              <p className="text-sm text-slate-400">No resources currently allocated.</p>
            ) : (
              utilizationData.map((emp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{emp.employeeName} <span className="text-xs text-slate-400 font-normal">({emp.department})</span></span>
                    <span className="font-semibold text-slate-950">{emp.utilization}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor(emp.utilization)}`} style={{ width: `${emp.utilization}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Leave Requests */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Leave Requests</h3>
            <div className="space-y-3">
              {leaves.length === 0 ? (
                <p className="text-sm text-slate-400">No pending leave requests.</p>
              ) : (
                leaves.map((r) => (
                  <div key={r._id} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 border border-amber-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {r.employee?.firstName} {r.employee?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {r.leaveType} — {r.startDate ? new Date(r.startDate).toLocaleDateString() : ''} to {r.endDate ? new Date(r.endDate).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveLeave(r._id)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-100" title="Approve">
                        <IoCheckmarkOutline size={17} />
                      </button>
                      <button onClick={() => handleRejectLeave(r._id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-100" title="Reject">
                        <IoCloseOutline size={17} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Timesheets */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Timesheets</h3>
            <div className="space-y-3">
              {timesheets.length === 0 ? (
                <p className="text-sm text-slate-400">No pending timesheets.</p>
              ) : (
                timesheets.map((t) => (
                  <div key={t._id} className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {t.employee?.firstName} {t.employee?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t.project?.projectName ?? 'Project'} — {t.hours}h on {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveTs(t._id)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-100" title="Approve">
                        <IoCheckmarkOutline size={17} />
                      </button>
                      <button onClick={() => handleRejectTs(t._id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-100" title="Reject">
                        <IoCloseOutline size={17} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ManagerDashboard
