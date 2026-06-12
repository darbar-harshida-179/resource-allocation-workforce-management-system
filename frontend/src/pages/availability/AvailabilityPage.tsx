import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmarkCircle, IoTimeOutline, IoAlertCircleOutline, IoEllipsisHorizontalCircleOutline } from 'react-icons/io5'

const AvailabilityPage = () => {
  const stats = [
    { label: 'Fully Available', count: 0, color: 'bg-green-50', icon: <IoCheckmarkCircle size={24} className="text-green-500" /> },
    { label: 'Partially Allocated', count: 1, color: 'bg-amber-50', icon: <IoTimeOutline size={24} className="text-amber-500" /> },
    { label: 'Fully Allocated', count: 2, color: 'bg-red-50', icon: <IoAlertCircleOutline size={24} className="text-red-500" /> },
    { label: 'On Leave', count: 1, color: 'bg-slate-50', icon: <IoEllipsisHorizontalCircleOutline size={24} className="text-slate-500" /> },
  ]

  const groups = [
    {
      label: 'Partially Allocated', dot: 'bg-amber-500', avatarBg: 'bg-amber-100', avatarText: 'text-amber-700', barColor: 'bg-amber-500',
      employees: [{ name: 'Vikram Singh', department: 'Engineering', utilization: 50 }],
    },
    {
      label: 'Fully Allocated', dot: 'bg-red-500', avatarBg: 'bg-red-100', avatarText: 'text-red-700', barColor: 'bg-red-500',
      employees: [{ name: 'Rohan Mehta', department: 'Engineering', utilization: 100 }, { name: 'Arjun Nair', department: 'Backend', utilization: 100 }],
    },
    {
      label: 'On Leave', dot: 'bg-slate-500', avatarBg: 'bg-slate-100', avatarText: 'text-slate-700', barColor: 'bg-slate-400',
      employees: [{ name: 'Ananya Patel', department: 'Design', utilization: 80 }],
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Resource Availability</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time workforce availability overview</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className={`rounded-xl ${s.color} p-4`}>
              <div className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {groups.map(g => (
            <div key={g.label}>
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
                <span className={`h-2.5 w-2.5 rounded-full ${g.dot}`} />
                {g.label} ({g.employees.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.employees.map(emp => (
                  <div key={emp.name} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${g.avatarBg} text-xs font-bold ${g.avatarText}`}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${g.barColor}`} style={{ width: `${emp.utilization}%` }} />
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-700">{emp.utilization}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default AvailabilityPage
