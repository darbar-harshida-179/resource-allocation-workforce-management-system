import MainLayout from '../../components/layout/MainLayout'

const AvailabilityPage = () => {
  const availabilityStats = [
    { label: 'Fully Available', count: 0, color: 'bg-green-50', dotColor: 'bg-green-500' },
    { label: 'Partially Allocated', count: 1, color: 'bg-amber-50', dotColor: 'bg-amber-500' },
    { label: 'Fully Allocated', count: 2, color: 'bg-red-50', dotColor: 'bg-red-500' },
    { label: 'On Leave', count: 1, color: 'bg-slate-50', dotColor: 'bg-slate-500' },
  ]

  const availabilityData = {
    fullyAvailable: [],
    partiallyAllocated: [
      { name: 'Vikram Singh', department: 'Engineering', utilization: 50 },
    ],
    fullyAllocated: [
      { name: 'Rohan Mehta', department: 'Engineering', utilization: 100 },
      { name: 'Arjun Nair', department: 'Backend', utilization: 100 },
    ],
    onLeave: [
      { name: 'Ananya Patel', department: 'Design', utilization: 80 },
    ],
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resource Availability</h1>
          <p className="mt-1 text-sm text-slate-600">Real-time workforce availability overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 lg:grid-cols-4">
          {availabilityStats.map((stat) => (
            <div key={stat.label} className={`rounded-lg p-6 ${stat.color}`}>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${stat.dotColor} opacity-20`} />
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Availability Groups */}
        <div className="space-y-6">
          {/* Partially Allocated */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              Partially Allocated ({availabilityData.partiallyAllocated.length} employee)
            </h3>
            <div className="space-y-3">
              {availabilityData.partiallyAllocated.map((emp) => (
                <div key={emp.name} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-600">{emp.department}</p>
                      </div>
                    </div>
                    <div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-1/2 bg-amber-500" />
                      </div>
                      <p className="mt-1 text-right text-sm font-semibold text-slate-900">{emp.utilization}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fully Allocated */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              Fully Allocated ({availabilityData.fullyAllocated.length} employees)
            </h3>
            <div className="space-y-3">
              {availabilityData.fullyAllocated.map((emp) => (
                <div key={emp.name} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-600">{emp.department}</p>
                      </div>
                    </div>
                    <div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-full bg-red-500" />
                      </div>
                      <p className="mt-1 text-right text-sm font-semibold text-slate-900">{emp.utilization}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On Leave */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span className="h-3 w-3 rounded-full bg-slate-500" />
              On Leave ({availabilityData.onLeave.length} employee)
            </h3>
            <div className="space-y-3">
              {availabilityData.onLeave.map((emp) => (
                <div key={emp.name} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-600">{emp.department}</p>
                      </div>
                    </div>
                    <div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-amber-500" style={{ width: `${emp.utilization}%` }} />
                      </div>
                      <p className="mt-1 text-right text-sm font-semibold text-slate-900">{emp.utilization}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default AvailabilityPage
