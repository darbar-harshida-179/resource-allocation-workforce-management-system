import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { IoBarChartOutline, IoFolderOutline, IoCalendarOutline, IoReloadOutline } from 'react-icons/io5'
import { getUtilizationReport, getProjectReport, getLeaveReport } from '../../services/reportService'
import { toast } from 'react-toastify'

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('Utilization')
  const [utilizationData, setUtilizationData] = useState<any[]>([])
  const [projectData, setProjectData] = useState<any[]>([])
  const [leaveData, setLeaveData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [utilRes, projRes, leaveRes] = await Promise.all([
        getUtilizationReport(),
        getProjectReport(),
        getLeaveReport()
      ])
      setUtilizationData(utilRes.data || [])
      setProjectData(projRes.data || [])
      setLeaveData(leaveRes.data || [])
    } catch {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const tabs = [
    { key: 'Utilization', label: 'Utilization Report', icon: <IoBarChartOutline size={16} /> },
    { key: 'Project', label: 'Project Report', icon: <IoFolderOutline size={16} /> },
    { key: 'Leave', label: 'Leave Report', icon: <IoCalendarOutline size={16} /> },
  ]

  const statusColor = (s: string) => {
    switch (s) {
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'on-hold': return 'bg-red-100 text-red-700'
      default: return 'bg-purple-100 text-purple-700'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'in-progress': return 'In Progress'
      case 'completed': return 'Completed'
      case 'on-hold': return 'On Hold'
      default: return 'Planning'
    }
  }

  const barColor = (n: number) => n === 100 ? 'bg-red-500' : n >= 50 ? 'bg-amber-500' : 'bg-green-500'

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
      <div className="space-y-5 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Analytics and workforce insights</p>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition
                ${activeTab === t.key ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {activeTab === 'Utilization' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md border border-slate-100">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Employee Utilization Report</p>
              <p className="mt-0.5 text-xs text-slate-500">Live data summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Employee','Allocation %','Actual Hours','Utilization %'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {utilizationData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.employeeName}</td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div className={`h-full ${barColor(r.allocationPercentage)}`} style={{ width: `${r.allocationPercentage}%` }} />
                          </div>
                          <span className="text-sm font-semibold">{r.allocationPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.actualHours}h</td>
                      <td className="px-4 py-3 font-semibold text-indigo-600 sm:px-6">{r.utilizationPercentage}%</td>
                    </tr>
                  ))}
                  {utilizationData.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-450">No utilization records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Project' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md border border-slate-100">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Project Report</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Project','Status','Resources','Total Hours'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {projectData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.projectName}</td>
                      <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.completionStatus)}`}>{statusLabel(r.completionStatus)}</span></td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.allocatedResources} allocated</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.totalHours}h</td>
                    </tr>
                  ))}
                  {projectData.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-450">No projects report found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Leave' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md border border-slate-100">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Department-wise Leave Summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Department','Approved Leaves'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {leaveData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.department}</td>
                      <td className="px-4 py-3 font-semibold text-green-600 sm:px-6">{r.totalLeaves}</td>
                    </tr>
                  ))}
                  {leaveData.length === 0 && (
                    <tr><td colSpan={2} className="py-8 text-center text-sm text-slate-450">No leave history found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default ReportsPage
