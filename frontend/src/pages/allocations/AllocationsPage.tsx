import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import { IoPencil, IoTrash, IoClose, IoLayersOutline } from 'react-icons/io5'

interface Allocation {
  id: number
  employee: string
  project: string
  allocation: number
  startDate: string
  endDate: string
}

const EMPLOYEE_OPTIONS = ['Rohan Mehta', 'Ananya Patel', 'Vikram Singh', 'Neha Gupta', 'Arjun Nair']
const PROJECT_OPTIONS = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta']

const getBarColor = (pct: number) => {
  if (pct === 100) return 'bg-red-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-green-500'
}

const AllocationsPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: 1, employee: 'Rohan Mehta', project: 'Project Alpha', allocation: 60, startDate: '2026-01-01', endDate: '2026-08-31' },
    { id: 2, employee: 'Rohan Mehta', project: 'Project Beta', allocation: 40, startDate: '2026-02-01', endDate: '2026-07-31' },
    { id: 3, employee: 'Ananya Patel', project: 'Project Alpha', allocation: 80, startDate: '2026-01-01', endDate: '2026-08-31' },
    { id: 4, employee: 'Vikram Singh', project: 'Project Delta', allocation: 50, startDate: '2026-04-01', endDate: '2026-12-31' },
    { id: 5, employee: 'Arjun Nair', project: 'Project Beta', allocation: 100, startDate: '2026-02-01', endDate: '2026-07-31' },
  ])

  // Compute utilization per employee
  const utilizationMap: Record<string, number> = {}
  allocations.forEach(({ employee, allocation }) => {
    utilizationMap[employee] = (utilizationMap[employee] || 0) + allocation
  })
  const utilizationList = EMPLOYEE_OPTIONS.map((name) => ({
    name,
    utilization: Math.min(utilizationMap[name] || 0, 100),
  }))

  const formik = useFormik({
    initialValues: {
      employee: '',
      project: '',
      allocationPercentage: '',
      startDate: '',
      endDate: '',
    },
    validationSchema: Yup.object({
      employee: Yup.string().required('Employee is required'),
      project: Yup.string().required('Project is required'),
      allocationPercentage: Yup.number()
        .typeError('Must be a number')
        .min(1, 'Minimum 1%')
        .max(100, 'Maximum 100%')
        .required('Allocation % is required'),
      startDate: Yup.string().required('Start date is required'),
      endDate: Yup.string()
        .required('End date is required')
        .test('is-after', 'End date must be after start date', function (value) {
          const { startDate } = this.parent
          return !startDate || !value || value > startDate
        }),
    }),
    onSubmit: (values, { resetForm }) => {
      const newAlloc: Allocation = {
        id: allocations.length + 1,
        employee: values.employee,
        project: values.project,
        allocation: Number(values.allocationPercentage),
        startDate: values.startDate,
        endDate: values.endDate,
      }
      setAllocations((prev) => [...prev, newAlloc])
      resetForm()
      setShowModal(false)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setShowModal(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Resource Allocations</h1>
            <p className="mt-1 text-sm text-slate-600">Manage project assignments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <IoLayersOutline size={18} />
            New Allocation
          </button>
        </div>

        {/* Utilization Summary */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Employee Utilization Summary</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {utilizationList.map((emp) => (
              <div key={emp.name} className={`rounded-xl p-4 ${emp.utilization === 100 ? 'bg-red-50' : emp.utilization >= 60 ? 'bg-amber-50' : 'bg-green-50'}`}>
                <p className="truncate text-sm font-medium text-slate-900">{emp.name}</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/60">
                  <div
                    className={`h-full transition-all ${getBarColor(emp.utilization)}`}
                    style={{ width: `${emp.utilization}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs font-semibold text-slate-700">{emp.utilization}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Allocation</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Period</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc) => (
                  <tr key={alloc.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{alloc.employee}</td>
                    <td className="px-6 py-4 font-medium text-indigo-600">{alloc.project}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full transition-all ${getBarColor(alloc.allocation)}`}
                            style={{ width: `${alloc.allocation}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{alloc.allocation}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{alloc.startDate} — {alloc.endDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">
                          <IoPencil size={16} />
                        </button>
                        <button
                          onClick={() => setAllocations((prev) => prev.filter((a) => a.id !== alloc.id))}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <IoTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {allocations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-500">No allocations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Allocation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoLayersOutline size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">New Allocation</h2>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              {/* Employee */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Employee</label>
                <select
                  name="employee"
                  value={formik.values.employee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select employee</option>
                  {EMPLOYEE_OPTIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                {formik.touched.employee && formik.errors.employee && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.employee}</p>
                )}
              </div>

              {/* Project */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Project</label>
                <select
                  name="project"
                  value={formik.values.project}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select project</option>
                  {PROJECT_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {formik.touched.project && formik.errors.project && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.project}</p>
                )}
              </div>

              {/* Allocation Percentage */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Allocation Percentage</label>
                <div className="relative">
                  <input
                    name="allocationPercentage"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="e.g. 50"
                    value={formik.values.allocationPercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                </div>
                {formik.touched.allocationPercentage && formik.errors.allocationPercentage && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.allocationPercentage}</p>
                )}
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70"
                >
                  Create Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default AllocationsPage
