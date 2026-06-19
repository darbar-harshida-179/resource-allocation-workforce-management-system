import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmarkCircle, IoCloseCircle, IoAddCircleOutline, IoCalendarOutline, IoListOutline, IoCreateOutline, IoReloadOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { getLeaves, getMyLeaves, applyLeave, approveLeave, rejectLeave } from '../../services/leaveService'
import { getEmployeeDashboard } from '../../services/dashboardService'
import { toast } from 'react-toastify'

interface Leave {
  _id: string
  employee?: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: string
}

const statusColor = (s: string) => s === 'approved' ? 'bg-green-100 text-green-700' : s === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
const statusLabel = (s: string) => s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Pending'
const typeColor = (t: string) => t === 'casual' ? 'bg-blue-100 text-blue-700' : t === 'sick' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
const typeLabel = (t: string) => t === 'casual' ? 'Casual' : t === 'sick' ? 'Sick' : 'Earned'

const ic = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const TABS = ['All', 'pending', 'approved', 'rejected']
const TAB_LABELS: Record<string, string> = { All: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }

const AdminLeaveView = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  const fetchAllLeaves = async () => {
    try {
      setLoading(true)
      const res = await getLeaves()
      setLeaves(res.data || [])
    } catch {
      toast.error('Failed to load leave requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllLeaves()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id)
      toast.success('Leave approved successfully')
      fetchAllLeaves()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve leave')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectLeave(id)
      toast.success('Leave rejected successfully')
      fetchAllLeaves()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject leave')
    }
  }
  const filtered = activeTab === 'All'
    ? leaves
    : leaves.filter(l => l.status === activeTab)

  const paginatedLeaves = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Leave Management</h1>
        <p className="mt-1 text-sm text-slate-500">Manage employee leave requests</p>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>{['Employee', 'Type', 'From', 'To', 'Reason', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginatedLeaves.map(l => (
                <tr key={l._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                    {l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : 'Unknown Employee'}
                  </td>
                  <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeColor(l.leaveType)}`}>{typeLabel(l.leaveType)}</span></td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{new Date(l.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{l.reason}</td>
                  <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(l.status)}`}>{statusLabel(l.status)}</span></td>
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex gap-1">
                      {l.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(l._id)} className="rounded-lg p-1 text-green-600 hover:bg-green-50"><IoCheckmarkCircle size={20} /></button>
                          <button onClick={() => handleReject(l._id)} className="rounded-lg p-1 text-red-500 hover:bg-red-50"><IoCloseCircle size={20} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">No leave requests found.</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
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
    </div>
  )
}

const EmployeeLeaveView = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [myLeaves, setMyLeaves] = useState<Leave[]>([])
  const [balancesData, setBalancesData] = useState({ casual: 0, sick: 0, earned: 0 })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  const fetchEmployeeData = async () => {
    try {
      setLoading(true)
      const [leavesRes, dashRes] = await Promise.all([
        getMyLeaves(),
        getEmployeeDashboard(),
      ])
      setMyLeaves(leavesRes.data || [])
      if (dashRes.data?.leaveBalance) {
        setBalancesData(dashRes.data.leaveBalance)
      }
    } catch {
      toast.error('Failed to load leave logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeeData()
  }, [])


  const balances = [
    { label: 'Casual Leave', remaining: balancesData.casual, color: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Sick Leave', remaining: balancesData.sick, color: 'bg-red-50', dot: 'bg-red-400', text: 'text-red-600' },
    { label: 'Earned Leave', remaining: balancesData.earned, color: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-600' },
  ]

  const formik = useFormik({
    initialValues: { type: '', from: '', to: '', reason: '' },
    validationSchema: Yup.object({
      type: Yup.string().required('Leave type is required'),
      from: Yup.string().required('From date is required'),
      to: Yup.string().required('To date is required').test('after', 'Must be same or after from date', function (v) { return !this.parent.from || !v || v >= this.parent.from }),
      reason: Yup.string().trim().required('Reason is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await applyLeave({
          leaveType: values.type,
          startDate: values.from,
          endDate: values.to,
          reason: values.reason,
        })
        toast.success('Leave applied successfully')
        resetForm()
        setShowModal(false)
        fetchEmployeeData()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to submit leave request')
      }
    },
  })

  const filtered = activeTab === 'All'
    ? myLeaves
    : myLeaves.filter(l => l.status === activeTab)

  const paginatedLeaves = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  )


  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-5 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Leave Management</h1>
          <p className="mt-1 text-sm text-slate-500">Track and apply for your leaves</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto">
          <IoAddCircleOutline size={18} /> Apply Leave
        </button>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {balances.map(b => (
          <div key={b.label} className={`rounded-xl ${b.color} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2.5 w-2.5 rounded-full ${b.dot}`} />
              <p className="text-sm font-medium text-slate-700">{b.label}</p>
            </div>
            <p className={`text-3xl font-bold ${b.text}`}>{b.remaining}</p>
            <p className="mt-0.5 text-xs text-slate-500">Remaining</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>{['Leave Type', 'From', 'To', 'Reason', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>)}</tr>
            </thead>
            <tbody>
              {paginatedLeaves.map(l => (
                <tr key={l._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeColor(l.leaveType)}`}>{typeLabel(l.leaveType)}</span></td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{new Date(l.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{l.reason}</td>
                  <td className="px-4 py-3 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(l.status)}`}>{statusLabel(l.status)}</span></td>
                </tr>
              ))}
              {paginatedLeaves.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No leave requests found.</td></tr>}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100"><IoCalendarOutline size={18} className="text-indigo-600" /></div>
                <h2 className="text-lg font-semibold text-slate-900">Apply Leave</h2>
              </div>
              <button onClick={() => { formik.resetForm(); setShowModal(false) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><IoCloseCircle size={20} /></button>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Type</label>
                <div className="relative">
                  <IoListOutline className={ic} size={16} />
                  <select name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp}>
                    <option value="">Select leave type</option>
                    <option value="casual">Casual</option>
                    <option value="sick">Sick</option>
                    <option value="earned">Earned</option>
                  </select>
                </div>
                {formik.touched.type && formik.errors.type && <p className="mt-1 text-xs text-red-500">{formik.errors.type}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">From</label>
                  <div className="relative">
                    <IoCalendarOutline className={ic} size={16} />
                    <input name="from" type="date" value={formik.values.from} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                  </div>
                  {formik.touched.from && formik.errors.from && <p className="mt-1 text-xs text-red-500">{formik.errors.from}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">To</label>
                  <div className="relative">
                    <IoCalendarOutline className={ic} size={16} />
                    <input name="to" type="date" value={formik.values.to} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                  </div>
                  {formik.touched.to && formik.errors.to && <p className="mt-1 text-xs text-red-500">{formik.errors.to}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
                <div className="relative">
                  <IoCreateOutline className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                  <textarea name="reason" rows={2} placeholder="Brief reason for leave..." value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
                {formik.touched.reason && formik.errors.reason && <p className="mt-1 text-xs text-red-500">{formik.errors.reason}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { formik.resetForm(); setShowModal(false) }} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={formik.isSubmitting} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70 font-semibold">Apply Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const LeaveRequestsPage = () => {
  const { user } = useAuth()
  return <MainLayout>{user?.role === 'employee' ? <EmployeeLeaveView /> : <AdminLeaveView />}</MainLayout>
}

export default LeaveRequestsPage
