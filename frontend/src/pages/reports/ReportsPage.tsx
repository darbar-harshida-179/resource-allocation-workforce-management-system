import { useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { IoBarChartOutline, IoFolderOutline, IoCalendarOutline } from 'react-icons/io5'

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('Utilization')

  const utilizationData = [
    { employee: 'Rohan Mehta', department: 'Engineering', allocated: 100, hours: '3h', utilization: '2%' },
    { employee: 'Ananya Patel', department: 'Design', allocated: 80, hours: '0h', utilization: '0%' },
    { employee: 'Vikram Singh', department: 'Engineering', allocated: 50, hours: '6h', utilization: '4%' },
    { employee: 'Neha Gupta', department: 'QA', allocated: 0, hours: '0h', utilization: '0%' },
    { employee: 'Arjun Nair', department: 'Backend', allocated: 100, hours: '0h', utilization: '0%' },
  ]
  const projectData = [
    { project: 'Project Alpha', status: 'In Progress', resources: '2 allocated', hours: '13h', progress: 60 },
    { project: 'Project Beta', status: 'In Progress', resources: '2 allocated', hours: '3h', progress: 40 },
    { project: 'Project Gamma', status: 'Completed', resources: '0 allocated', hours: '0h', progress: 100 },
    { project: 'Project Delta', status: 'Planning', resources: '1 allocated', hours: '6h', progress: 10 },
  ]
  const leaveData = [
    { department: 'Engineering', total: 2, approved: 0, pending: 2, rejected: 0 },
    { department: 'Design', total: 1, approved: 1, pending: 0, rejected: 0 },
    { department: 'QA', total: 0, approved: 0, pending: 0, rejected: 0 },
    { department: 'Backend', total: 1, approved: 0, pending: 0, rejected: 1 },
  ]

  const tabs = [
    { key: 'Utilization', label: 'Utilization Report', icon: <IoBarChartOutline size={16} /> },
    { key: 'Project', label: 'Project Report', icon: <IoFolderOutline size={16} /> },
    { key: 'Leave', label: 'Leave Report', icon: <IoCalendarOutline size={16} /> },
  ]

  const statusColor = (s: string) => s === 'In Progress' ? 'bg-blue-100 text-blue-700' : s === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
  const barColor = (n: number) => n === 100 ? 'bg-red-500' : n >= 50 ? 'bg-amber-500' : 'bg-green-500'

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
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Employee Utilization Report</p>
              <p className="mt-0.5 text-xs text-slate-500">June 2026</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Employee','Department','Allocated %','Actual Hours','Utilization %'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {utilizationData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.employee}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.department}</td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div className={`h-full ${barColor(r.allocated)}`} style={{ width: `${r.allocated}%` }} />
                          </div>
                          <span className="text-sm font-semibold">{r.allocated}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.hours}</td>
                      <td className="px-4 py-3 font-semibold text-red-600 sm:px-6">{r.utilization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Project' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Project Report</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Project','Status','Resources','Total Hours','Progress'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {projectData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.project}</td>
                      <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.resources}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">{r.hours}</td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full bg-indigo-600" style={{ width: `${r.progress}%` }} />
                          </div>
                          <span className="text-sm font-semibold">{r.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Leave' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="font-semibold text-slate-900">Department-wise Leave Summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>{['Department','Total','Approved','Pending','Rejected'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {leaveData.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{r.department}</td>
                      <td className="px-4 py-3 text-slate-700 sm:px-6">{r.total}</td>
                      <td className="px-4 py-3 font-semibold text-green-600 sm:px-6">{r.approved}</td>
                      <td className="px-4 py-3 font-semibold text-amber-600 sm:px-6">{r.pending}</td>
                      <td className="px-4 py-3 font-semibold text-red-600 sm:px-6">{r.rejected}</td>
                    </tr>
                  ))}
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
