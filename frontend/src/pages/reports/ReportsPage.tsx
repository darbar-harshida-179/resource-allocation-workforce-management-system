import { useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'

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

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
            <p className="mt-1 text-sm text-slate-600">Analytics and workforce insights</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {['Utilization', 'Project', 'Leave'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab} Report
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Utilization' && (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="border-b border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-900">Employee Utilization Report</h3>
              <p className="mt-1 text-sm text-slate-600">June 2026</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">EMPLOYEE</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">DEPARTMENT</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">ALLOCATED %</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">ACTUAL HOURS</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">UTILIZATION %</th>
                  </tr>
                </thead>
                <tbody>
                  {utilizationData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.employee}</td>
                      <td className="px-6 py-4 text-slate-700">{row.department}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full ${
                                row.allocated === 100
                                  ? 'bg-red-500'
                                  : row.allocated >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${row.allocated}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{row.allocated}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{row.hours}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">{row.utilization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Project' && (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="border-b border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-900">Project Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">PROJECT</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">STATUS</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">RESOURCES</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">TOTAL HOURS</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">PROGRESS</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.project}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700'
                              : row.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{row.resources}</td>
                      <td className="px-6 py-4 text-slate-700">{row.hours}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full bg-indigo-600" style={{ width: `${row.progress}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{row.progress}%</span>
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
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="border-b border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-900">Department-wise Leave Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">DEPARTMENT</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">TOTAL REQUESTS</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">APPROVED</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">PENDING</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">REJECTED</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.department}</td>
                      <td className="px-6 py-4 text-slate-700">{row.total}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{row.approved}</td>
                      <td className="px-6 py-4 text-amber-600 font-semibold">{row.pending}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">{row.rejected}</td>
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
