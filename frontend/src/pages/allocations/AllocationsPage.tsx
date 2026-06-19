import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import MainLayout from '../../components/layout/MainLayout'
import {
  IoPencil, IoTrash, IoClose, IoLayersOutline, IoWarningOutline,
  IoPersonOutline, IoFolderOutline, IoCalendarOutline, IoStatsChartOutline, IoReloadOutline,
} from 'react-icons/io5'
import { getAllocations, createAllocation, updateAllocation, deleteAllocation } from '../../services/allocationService'
import { getAllEmployees } from '../../services/employeeService'
import { getProjects } from '../../services/projectService'

interface Allocation {
  _id: string
  employee?: {
    _id: string
    firstName: string
    lastName: string
    department?: string
  }
  project?: {
    _id: string
    projectName: string
  }
  allocationPercentage: number
  startDate: string
  endDate: string
}

const getBarColor = (p: number) => p === 100 ? 'bg-red-500' : p >= 60 ? 'bg-amber-500' : 'bg-green-500'

const schema = Yup.object({
  employee: Yup.string().required('Employee is required'),
  project: Yup.string().required('Project is required'),
  allocationPercentage: Yup.number().typeError('Must be a number').min(1, 'Min 1%').max(100, 'Max 100%').required('Required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required').test('after', 'Must be after start date', function (v) { return !this.parent.startDate || !v || v > this.parent.startDate }),
})

const ic = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const ModalForm = ({ formik, submitLabel, onCancel, employees, projects }: { formik: any; submitLabel: string; onCancel: () => void; employees: any[]; projects: any[] }) => (
  <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Employee</label>
      <div className="relative">
        <IoPersonOutline className={ic} size={16} />
        <select name="employee" value={formik.values.employee} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp}>
          <option value="">Select employee</option>
          {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
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
          {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
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
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  const fetchData = async () => {
    try {
      setLoading(true)
      const [allocRes, empRes, projRes] = await Promise.all([
        getAllocations(),
        getAllEmployees(),
        getProjects(),
      ])
      setAllocations(allocRes.data || [])
      setEmployees(empRes.data || [])
      setProjects(projRes.data || [])
    } catch {
      toast.error('Failed to load allocations data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate dynamic utilization summaries per employee
  const utilizationMap: Record<string, { name: string; utilization: number }> = {}

  // Initialize map with all employees
  employees.forEach(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`
    utilizationMap[emp._id] = { name: fullName, utilization: 0 }
  })

  // Aggregate allocations
  allocations.forEach(alloc => {
    if (alloc.employee?._id && utilizationMap[alloc.employee._id]) {
      utilizationMap[alloc.employee._id].utilization += alloc.allocationPercentage
    }
  })

  const utilizationList = Object.values(utilizationMap).map(item => ({
    name: item.name,
    utilization: Math.min(item.utilization, 100),
  }))

  const totalPages = Math.ceil(
    allocations.length / ITEMS_PER_PAGE
  )

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE

  const paginatedAllocations =
    allocations.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )

  const addFormik = useFormik({
    initialValues: { employee: '', project: '', allocationPercentage: '', startDate: '', endDate: '' },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createAllocation({
          employee: values.employee,
          project: values.project,
          allocationPercentage: Number(values.allocationPercentage),
          startDate: values.startDate,
          endDate: values.endDate,
        })
        toast.success('Allocation created successfully')
        resetForm()
        setShowAdd(false)
        fetchData()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to create allocation')
      }
    },
  })

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employee: editAlloc?.employee?._id ?? '',
      project: editAlloc?.project?._id ?? '',
      allocationPercentage: editAlloc?.allocationPercentage?.toString() ?? '',
      startDate: editAlloc?.startDate ? new Date(editAlloc.startDate).toISOString().split('T')[0] : '',
      endDate: editAlloc?.endDate ? new Date(editAlloc.endDate).toISOString().split('T')[0] : '',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateAllocation(editAlloc!._id, {
          employee: values.employee,
          project: values.project,
          allocationPercentage: Number(values.allocationPercentage),
          startDate: values.startDate,
          endDate: values.endDate,
        })
        toast.success('Allocation updated successfully')
        resetForm()
        setEditAlloc(null)
        fetchData()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update allocation')
      }
    },
  })

  const handleDelete = async () => {
    try {
      await deleteAllocation(deleteAlloc!._id)
      toast.success('Allocation deleted successfully')
      setDeleteAlloc(null)
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete allocation')
    }
  }

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
            {utilizationList.length === 0 && (
              <p className="text-xs text-slate-400">No employee utilization data.</p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>{['Employee', 'Project', 'Allocation', 'Period', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
              </thead>
              <tbody>
                {paginatedAllocations.map(a => (
                  <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                      {a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 font-medium text-indigo-600 sm:px-6">
                      {a.project ? a.project.projectName : 'Unknown Project'}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${getBarColor(a.allocationPercentage)}`} style={{ width: `${a.allocationPercentage}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{a.allocationPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 sm:px-6">
                      {new Date(a.startDate).toLocaleDateString()} — {new Date(a.endDate).toLocaleDateString()}
                    </td>
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
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3 border-t border-slate-200 pt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Previous
            </button>

            <span className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Next
            </button>
          </div>
        )}
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
            <ModalForm formik={addFormik} submitLabel="Create Allocation" onCancel={() => { addFormik.resetForm(); setShowAdd(false) }} employees={employees} projects={projects} />
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
            <ModalForm formik={editFormik} submitLabel="Save Changes" onCancel={() => setEditAlloc(null)} employees={employees} projects={projects} />
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
              <p className="mt-2 text-sm text-slate-500">
                Delete allocation for <span className="font-semibold text-slate-800">{deleteAlloc.employee ? `${deleteAlloc.employee.firstName} ${deleteAlloc.employee.lastName}` : 'Unassigned'}</span> on <span className="font-semibold text-slate-800">{deleteAlloc.project ? deleteAlloc.project.projectName : 'Unknown'}</span>?
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteAlloc(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">No, Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default AllocationsPage
