import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmark, IoClose } from 'react-icons/io5'

const TimesheetsPage = () => {
  const timesheets = [
    {
      id: 1,
      employee: 'Rohan Mehta',
      date: '2026-06-09',
      project: 'Project Alpha',
      hours: '5h',
      status: 'Pending',
    },
    {
      id: 2,
      employee: 'Rohan Mehta',
      date: '2026-06-09',
      project: 'Project Beta',
      hours: '3h',
      status: 'Approved',
    },
    {
      id: 3,
      employee: 'Ananya Patel',
      date: '2026-06-09',
      project: 'Project Alpha',
      hours: '8h',
      status: 'Pending',
    },
    {
      id: 4,
      employee: 'Vikram Singh',
      date: '2026-06-09',
      project: 'Project Delta',
      hours: '6h',
      status: 'Approved',
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Timesheets</h1>
          <p className="mt-1 text-sm text-slate-600">Manage employee timesheets</p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">EMPLOYEE</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">DATE</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">PROJECT</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">HOURS</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">STATUS</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{timesheet.employee}</td>
                    <td className="px-6 py-4 text-slate-700">{timesheet.date}</td>
                    <td className="px-6 py-4 text-slate-700">{timesheet.project}</td>
                    <td className="px-6 py-4 text-slate-700">{timesheet.hours}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          timesheet.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {timesheet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="rounded p-2 text-green-600 hover:bg-green-100">
                          <IoCheckmark size={18} />
                        </button>
                        <button className="rounded p-2 text-red-600 hover:bg-red-100">
                          <IoClose size={18} />
                        </button>
                      </div>
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

export default TimesheetsPage
