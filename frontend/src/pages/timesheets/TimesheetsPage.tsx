import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmarkCircle, IoCloseCircle, IoAddCircleOutline, IoClose, IoReloadOutline, IoCalendarOutline, IoTimeOutline, IoFolderOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getTimesheets, getMyTimesheets, submitTimesheet, approveTimesheet, rejectTimesheet } from '../../services/timesheetService'
import { getProjects } from '../../services/projectService'
import { toast } from 'react-toastify'

interface Timesheet {
  _id: string
  employee?: {
    _id: string
    firstName: string
    lastName: string
  }
  project?: {
    _id: string
    projectName: string
  }
  date: string
  hours: number
  status: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return 'Pending'
  }
}

// ── Employee View ──
const EmployeeTimesheetView = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchEmployeeData = async () => {
    try {
      setLoading(true)
      const [tsRes, projRes] = await Promise.all([
        getMyTimesheets(),
        getProjects(),
      ])
      setTimesheets(tsRes.data || [])
      setProjects(projRes.data || [])
    } catch {
      toast.error('Failed to load timesheets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeeData()
  }, [])

  const formik = useFormik({
    initialValues: { project: '', date: '', hours: '' },
    validationSchema: Yup.object({
      project: Yup.string().required('Project is required'),
      date: Yup.string().required('Date is required'),
      hours: Yup.number().typeError('Must be a number').min(1, 'Min 1 hour').max(24, 'Max 24 hours').required('Hours is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await submitTimesheet({
          project: values.project,
          date: values.date,
          hours: Number(values.hours),
        })
        toast.success('Timesheet submitted successfully')
        resetForm()
        setShowModal(false)
        fetchEmployeeData()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to submit timesheet')
      }
    },
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Timesheets</h1>
          <p className="mt-1 text-sm text-slate-500">Your submitted timesheet entries</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto">
          <IoAddCircleOutline size={18} /> Submit Timesheet
        </button>
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
              {timesheets.map((ts) => (
                <tr key={ts._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-700">{new Date(ts.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-700">{ts.project?.projectName ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-700">{ts.hours}h</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(ts.status)}`}>
                      {getStatusLabel(ts.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {timesheets.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-sm text-slate-400">No timesheets submitted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100"><IoTimeOutline size={18} className="text-indigo-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">Submit Timesheet</h2>
              </div>
              <button onClick={() => { formik.resetForm(); setShowModal(false) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><IoClose size={20} /></button>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Project</label>
                <div className="relative">
                  <IoFolderOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <select name="project" value={formik.values.project} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                  </select>
                </div>
                {formik.touched.project && formik.errors.project && <p className="mt-1 text-xs text-red-500">{formik.errors.project}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
                  <div className="relative">
                    <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <input name="date" type="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  {formik.touched.date && formik.errors.date && <p className="mt-1 text-xs text-red-500">{formik.errors.date}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Hours</label>
                  <div className="relative">
                    <IoTimeOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <input name="hours" type="number" min={1} max={24} placeholder="e.g. 8" value={formik.values.hours} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  {formik.touched.hours && formik.errors.hours && <p className="mt-1 text-xs text-red-500">{formik.errors.hours}</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { formik.resetForm(); setShowModal(false) }} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={formik.isSubmitting} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70 font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Admin/Manager View ──
const AdminTimesheetView = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllTimesheets = async () => {
    try {
      setLoading(true)
      const res = await getTimesheets()
      setTimesheets(res.data || [])
    } catch {
      toast.error('Failed to fetch timesheets logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTimesheets()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await approveTimesheet(id)
      toast.success('Timesheet approved successfully')
      fetchAllTimesheets()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve timesheet')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectTimesheet(id)
      toast.success('Timesheet rejected successfully')
      fetchAllTimesheets()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject timesheet')
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

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
                <tr key={ts._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {ts.employee ? `${ts.employee.firstName} ${ts.employee.lastName}` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(ts.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-600">{ts.project?.projectName ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{ts.hours}h</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(ts.status)}`}>
                      {getStatusLabel(ts.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {ts.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(ts._id)}
                            className="rounded-lg p-1 text-green-600 transition hover:bg-green-50">
                            <IoCheckmarkCircle size={20} />
                          </button>
                          <button onClick={() => handleReject(ts._id)}
                            className="rounded-lg p-1 text-red-500 transition hover:bg-red-50">
                            <IoCloseCircle size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {timesheets.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No timesheets submitted.</td></tr>
              )}
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
