import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import MainLayout from '../../components/layout/MainLayout'
import {
  IoPencil, IoTrash, IoClose, IoLayersOutline, IoWarningOutline,
  IoPersonOutline, IoFolderOutline, IoCalendarOutline, IoStatsChartOutline,
} from 'react-icons/io5'

interface Allocation { id: number; employee: string; project: string; allocation: number; startDate: string; endDate: string }

const EMPLOYEE_OPTIONS = ['Rohan Mehta', 'Ananya Patel', 'Vikram Singh', 'Neha Gupta', 'Arjun Nair']
const PROJECT_OPTIONS = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta']
const getBarColor = (p: number) => p === 100 ? 'bg-red-500' : p >= 60 ? 'bg-amber-500' : 'bg-green-500'

const schema = Yup.object({
  employee: Yup.string().required('Employee is required'),
  project: Yup.string().required('Project is required'),
  allocationPercentage: Yup.number().typeError('Must be a number').min(1,'Min 1%').max(100,'Max 100%').required('Required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required').test('after', 'Must be after start date', function(v) { return !this.parent.startDate || !v || v > this.parent.startDate }),
})

const ic = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const ModalForm = ({ formik, submitLabel, onCancel }: { formik: any; submitLabel: string; onCancel: () => void }) => (
  <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Employee</label>
      <div className="relative">
        <IoPersonOutline className={ic} size={16} />
        <select name="employee" value={formik.values.employee} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp}>
          <option value="">Select employee</option>
          {EMPLOYEE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      {formik.touched.employee && formik.errors.employee && <p className="mt-1 text-xs text-red-500">{formik.errors.employee}</p>}
    </div>
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Project</label>
      <div className="relative">
        <IoFolderOutline className={ic} size={16} />
        <select name="project" value={formik.values.project} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp}>
          <option value="">Select project</option>
          {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      {formik.touched.project && formik.errors.project && <p className="mt-1 text-xs text-red-500">{formik.errors.project}</p>}
    </div>
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Allocation Percentage</label>
      <div className="relative">
        <IoStatsChartOutline className={ic} size={16} />
        <input name="allocationPercentage" type="number" min={1} max={100} placeholder="e.g. 50"
          value={formik.values.allocationPercentage} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
      </div>
      {formik.touched.allocationPercentage && formik.errors.allocationPercentage && <p className="mt-1 text-xs text-red-500">{formik.errors.allocationPercentage}</p>}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
        <div className="relative">
          <IoCalendarOutline className={ic} size={16} />
          <input name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
        </div>
        {formik.touched.startDate && formik.errors.startDate && <p className="mt-1 text-xs text-red-500">{formik.errors.startDate}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
        <div className="relative">
          <IoCalendarOutline className={ic} size={16} />
          <input name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
        </div>
        {formik.touched.endDate && formik.errors.endDate && <p className="mt-1 text-xs text-red-500">{formik.errors.endDate}</p>}
      </div>
    </div>
    <div className="flex gap-3 pt-1">
      <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
      <button type="submit" disabled={formik.isSubmitting} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70">{submitLabel}</button>
    </div>
  </form>
)

const AllocationsPage = () => {
  const [showAdd, setShowAdd] = useState(false)
  const [editAlloc, setEditAlloc] = useState<Allocation | null>(null)
  const [deleteAlloc, setDeleteAlloc] = useState<Allocation | null>(null)
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: 1, employee: 'Rohan Mehta', project: 'Project Alpha', allocation: 60, startDate: '2026-01-01', endDate: '2026-08-31' },
    { id: 2, employee: 'Rohan Mehta', project: 'Project Beta', allocation: 40, startDate: '2026-02-01', endDate: '2026-07-31' },
    { id: 3, employee: 'Ananya Patel', project: 'Project Alpha', allocation: 80, startDate: '2026-01-01', endDate: '2026-08-31' },
    { id: 4, employee: 'Vikram Singh', project: 'Project Delta', allocation: 50, startDate: '2026-04-01', endDate: '2026-12-31' },
    { id: 5, employee: 'Arjun Nair', project: 'Project Beta', allocation: 100, startDate: '2026-02-01', endDate: '2026-07-31' },
  ])

  const utilizationMap: Record<string, number> = {}
  allocations.forEach(({ employee, allocation }) => { utilizationMap[employee] = (utilizationMap[employee] || 0) + allocation })
  const utilizationList = EMPLOYEE_OPTIONS.map(name => ({ name, utilization: Math.min(utilizationMap[name] || 0, 100) }))

  const addFormik = useFormik({
    initialValues: { employee: '', project: '', allocationPercentage: '', startDate: '', endDate: '' },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      setAllocations(prev => [...prev, { id: Date.now(), employee: values.employee, project: values.project, allocation: Number(values.allocationPercentage), startDate: values.startDate, endDate: values.endDate }])
      resetForm(); setShowAdd(false)
    },
  })

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: { employee: editAlloc?.employee ?? '', project: editAlloc?.project ?? '', allocationPercentage: editAlloc?.allocation?.toString() ?? '', startDate: editAlloc?.startDate ?? '', endDate: editAlloc?.endDate ?? '' },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      setAllocations(prev => prev.map(a => a.id === editAlloc!.id ? { ...a, employee: values.employee, project: values.project, allocation: Number(values.allocationPercentage), startDate: values.startDate, endDate: values.endDate } : a))
      toast.success('Allocation updated successfully'); resetForm(); setEditAlloc(null)
    },
  })

  return (
    <MainLayout>
      <div className="space-y-5 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Resource Allocations</h1>
            <p className="mt-1 text-sm text-slate-500">Manage project assignments</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto">
            <IoLayersOutline size={18} /> New Allocation
          </button>
        </div>

        {/* Utilization summary */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Employee Utilization Summary</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {utilizationList.map(emp => (
              <div key={emp.name} className={`rounded-xl p-3 ${emp.utilization === 100 ? 'bg-red-50' : emp.utilization >= 60 ? 'bg-amber-50' : 'bg-green-50'}`}>
                <p className="truncate text-xs font-medium text-slate-900">{emp.name}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                  <div className={`h-full transition-all ${getBarColor(emp.utilization)}`} style={{ width: `${emp.utilization}%` }} />
                </div>
                <p className="mt-1 text-right text-xs font-semibold text-slate-700">{emp.utilization}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>{['Employee','Project','Allocation','Period','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">{a.employee}</td>
                    <td className="px-4 py-3 font-medium text-indigo-600 sm:px-6">{a.project}</td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${getBarColor(a.allocation)}`} style={{ width: `${a.allocation}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{a.allocation}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 sm:px-6">{a.startDate} — {a.endDate}</td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex gap-1">
                        <button onClick={() => setEditAlloc(a)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-50"><IoPencil size={15} /></button>
                        <button onClick={() => setDeleteAlloc(a)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><IoTrash size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {allocations.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No allocations found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100"><IoLayersOutline size={18} className="text-indigo-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">New Allocation</h2>
              </div>
              <button onClick={() => { addFormik.resetForm(); setShowAdd(false) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><IoClose size={20} /></button>
            </div>
            <ModalForm formik={addFormik} submitLabel="Create Allocation" onCancel={() => { addFormik.resetForm(); setShowAdd(false) }} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editAlloc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100"><IoPencil size={18} className="text-indigo-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Allocation</h2>
              </div>
              <button onClick={() => setEditAlloc(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><IoClose size={20} /></button>
            </div>
            <ModalForm formik={editFormik} submitLabel="Save Changes" onCancel={() => setEditAlloc(null)} />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteAlloc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100"><IoWarningOutline size={28} className="text-red-600" /></div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Delete Allocation</h2>
              <p className="mt-2 text-sm text-slate-500">Delete allocation for <span className="font-semibold text-slate-800">{deleteAlloc.employee}</span> on <span className="font-semibold text-slate-800">{deleteAlloc.project}</span>?</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteAlloc(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">No, Cancel</button>
              <button onClick={() => { setAllocations(p => p.filter(a => a.id !== deleteAlloc!.id)); toast.success('Deleted successfully'); setDeleteAlloc(null) }} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default AllocationsPage
