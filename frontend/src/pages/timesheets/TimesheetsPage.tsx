import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700'
    case 'Rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

// ── Employee View ──
const EmployeeTimesheetView = () => {
  const myTimesheets = [
    { id: 1, date: '2026-06-09', project: 'Project Alpha', hours: '5h', status: 'Pending' },
    { id: 2, date: '2026-06-09', project: 'Project Beta', hours: '3h', status: 'Approved' },
  ]

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Timesheets</h1>
        <p className="mt-1 text-sm text-slate-500">Your submitted timesheet entries</p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Date', 'Project', 'Hours', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myTimesheets.map((ts) => (
                <tr key={ts.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-700">{ts.date}</td>
                  <td className="px-6 py-4 text-slate-700">{ts.project}</td>
                  <td className="px-6 py-4 text-slate-700">{ts.hours}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(ts.status)}`}>
                      {ts.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Admin/Manager View ──
const AdminTimesheetView = () => {
  const [timesheets, setTimesheets] = useState([
    { id: 1, employee: 'Rohan Mehta', date: '2026-06-09', project: 'Project Alpha', hours: '5h', status: 'Pending' },
    { id: 2, employee: 'Rohan Mehta', date: '2026-06-09', project: 'Project Beta', hours: '3h', status: 'Approved' },
    { id: 3, employee: 'Ananya Patel', date: '2026-06-09', project: 'Project Alpha', hours: '8h', status: 'Pending' },
    { id: 4, employee: 'Vikram Singh', date: '2026-06-09', project: 'Project Delta', hours: '6h', status: 'Approved' },
  ])

  const updateStatus = (id: number, status: string) =>
    setTimesheets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Timesheets</h1>
        <p className="mt-1 text-sm text-slate-500">Manage employee timesheets</p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Employee', 'Date', 'Project', 'Hours', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <tr key={ts.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{ts.employee}</td>
                  <td className="px-6 py-4 text-slate-600">{ts.date}</td>
                  <td className="px-6 py-4 text-slate-600">{ts.project}</td>
                  <td className="px-6 py-4 text-slate-600">{ts.hours}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(ts.status)}`}>
                      {ts.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {ts.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(ts.id, 'Approved')}
                            className="rounded-lg p-1 text-green-600 transition hover:bg-green-50">
                            <IoCheckmarkCircle size={20} />
                          </button>
                          <button onClick={() => updateStatus(ts.id, 'Rejected')}
                            className="rounded-lg p-1 text-red-500 transition hover:bg-red-50">
                            <IoCloseCircle size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Main ──
const TimesheetsPage = () => {
  const { user } = useAuth()

  return (
    <MainLayout>
      {user?.role === 'employee' ? <EmployeeTimesheetView /> : <AdminTimesheetView />}
    </MainLayout>
  )
}

export default TimesheetsPage
