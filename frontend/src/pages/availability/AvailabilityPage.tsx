import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmarkCircle, IoTimeOutline, IoAlertCircleOutline, IoEllipsisHorizontalCircleOutline, IoReloadOutline } from 'react-icons/io5'
import { getResourceAvailability } from '../../services/dashboardService'
import { toast } from 'react-toastify'

interface EmployeeData {
  employeeId: string
  name: string
  utilization: number
  available: number
}

interface LeaveData {
  _id: string
  employee?: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
}

const AvailabilityPage = () => {
  const [data, setData] = useState<{
    availableResources: EmployeeData[]
    partiallyAllocatedResources: EmployeeData[]
    fullyAllocatedResources: EmployeeData[]
    employeesOnLeave: LeaveData[]
  }>({
    availableResources: [],
    partiallyAllocatedResources: [],
    fullyAllocatedResources: [],
    employeesOnLeave: []
  })
  const [loading, setLoading] = useState(true)

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const res = await getResourceAvailability()
      setData({
        availableResources: res.availableResources || [],
        partiallyAllocatedResources: res.partiallyAllocatedResources || [],
        fullyAllocatedResources: res.fullyAllocatedResources || [],
        employeesOnLeave: res.employeesOnLeave || []
      })
    } catch {
      toast.error('Failed to load resource availability')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [])

  const stats = [
    { label: 'Fully Available', count: data.availableResources.length, color: 'bg-green-50', icon: <IoCheckmarkCircle size={24} className="text-green-500" /> },
    { label: 'Partially Allocated', count: data.partiallyAllocatedResources.length, color: 'bg-amber-50', icon: <IoTimeOutline size={24} className="text-amber-500" /> },
    { label: 'Fully Allocated', count: data.fullyAllocatedResources.length, color: 'bg-red-50', icon: <IoAlertCircleOutline size={24} className="text-red-500" /> },
    { label: 'On Leave Today', count: data.employeesOnLeave.length, color: 'bg-slate-50', icon: <IoEllipsisHorizontalCircleOutline size={24} className="text-slate-500" /> },
  ]

  const groups = [
    {
      label: 'Fully Available', dot: 'bg-green-500', avatarBg: 'bg-green-100', avatarText: 'text-green-700', barColor: 'bg-green-500',
      employees: data.availableResources,
    },
    {
      label: 'Partially Allocated', dot: 'bg-amber-500', avatarBg: 'bg-amber-100', avatarText: 'text-amber-700', barColor: 'bg-amber-500',
      employees: data.partiallyAllocatedResources,
    },
    {
      label: 'Fully Allocated', dot: 'bg-red-500', avatarBg: 'bg-red-100', avatarText: 'text-red-700', barColor: 'bg-red-500',
      employees: data.fullyAllocatedResources,
    },
    {
      label: 'On Leave Today', dot: 'bg-slate-500', avatarBg: 'bg-slate-100', avatarText: 'text-slate-700', barColor: 'bg-slate-400',
      employees: data.employeesOnLeave.map(item => ({
        employeeId: item.employee?._id || item._id,
        name: item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : 'Employee',
        utilization: 0,
        available: 100
      })),
    },
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
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Resource Availability</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time workforce availability overview</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className={`rounded-xl ${s.color} p-4 border border-slate-100`}>
              <div className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
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
                  <div key={emp.employeeId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${g.avatarBg} text-xs font-bold ${g.avatarText}`}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{emp.name}</p>
                          <p className="text-xs text-slate-500">Resource</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${g.barColor}`} style={{ width: `${emp.utilization}%` }} />
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-700">{emp.utilization}%</p>
                      </div>
                    </div>
                  </div>
                ))}
                {g.employees.length === 0 && (
                  <p className="text-sm text-slate-400 col-span-full">No resources in this group.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default AvailabilityPage
