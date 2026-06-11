import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import { IoCheckmark, IoClose, IoAddCircleOutline, IoCalendarOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

interface Leave {
  id: number
  type: string
  from: string
  to: string
  reason: string
  status: string
  employee?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-amber-100 text-amber-700'
    case 'Rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Casual': return 'bg-blue-100 text-blue-700'
    case 'Sick': return 'bg-red-100 text-red-700'
    case 'Earned': return 'bg-purple-100 text-purple-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

// ─── Admin View ───────────────────────────────────────────────
const AdminLeaveView = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, employee: 'Rohan Mehta', type: 'Casual', from: '2026-06-15', to: '2026-06-17', reason: 'Family event', status: 'Pending' },
    { id: 2, employee: 'Ananya Patel', type: 'Sick', from: '2026-06-10', to: '2026-06-11', reason: 'Fever', status: 'Approved' },
    { id: 3, employee: 'Vikram Singh', type: 'Earned', from: '2026-07-01', to: '2026-07-05', reason: 'Vacation', status: 'Pending' },
    { id: 4, employee: 'Arjun Nair', type: 'Casual', from: '2026-06-20', to: '2026-06-20', reason: 'Personal work', status: 'Rejected' },
  ])

  const filteredLeaves = activeTab === 'All' ? leaves : leaves.filter((l) => l.status === activeTab)

  const updateStatus = (id: number, status: string) =>
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Leave Management</h1>
        <p className="mt-1 text-sm text-slate-500">Manage employee leave requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Employee', 'Type', 'From', 'To', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{leave.employee}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeColor(leave.type)}`}>{leave.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{leave.from}</td>
                  <td className="px-6 py-4 text-slate-600">{leave.to}</td>
                  <td className="px-6 py-4 text-slate-600">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(leave.status)}`}>{leave.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateStatus(leave.id, 'Approved')}
                        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                      >
                        <IoCheckmark size={17} />
                      </button>
                      <button
                        onClick={() => updateStatus(leave.id, 'Rejected')}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <IoClose size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">No leave requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Employee View ────────────────────────────────────────────
const EmployeeLeaveView = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [myLeaves, setMyLeaves] = useState<Leave[]>([
    { id: 1, type: 'Casual', from: '2026-06-15', to: '2026-06-17', reason: 'Family event', status: 'Pending' },
  ])

  const balances = [
    { label: 'Casual Leave', remaining: 5, color: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Sick Leave', remaining: 4, color: 'bg-red-50', dot: 'bg-red-400', text: 'text-red-600' },
    { label: 'Earned Leave', remaining: 3, color: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-600' },
  ]

  const formik = useFormik({
    initialValues: { type: '', from: '', to: '', reason: '' },
    validationSchema: Yup.object({
      type: Yup.string().required('Leave type is required'),
      from: Yup.string().required('From date is required'),
      to: Yup.string()
        .required('To date is required')
        .test('is-after', 'To date must be same or after from date', function (value) {
          const { from } = this.parent
          return !from || !value || value >= from
        }),
      reason: Yup.string().trim().required('Reason is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const newLeave: Leave = {
        id: myLeaves.length + 1,
        type: values.type,
        from: values.from,
        to: values.to,
        reason: values.reason,
        status: 'Pending',
      }
      setMyLeaves((prev) => [...prev, newLeave])
      resetForm()
      setShowModal(false)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setShowModal(false)
  }

  const filtered = activeTab === 'All' ? myLeaves : myLeaves.filter((l) => l.status === activeTab)

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Leave Management</h1>
          <p className="mt-1 text-sm text-slate-500">Track and apply for your leaves</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <IoAddCircleOutline size={18} />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {balances.map((b) => (
          <div key={b.label} className={`rounded-xl ${b.color} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-2.5 w-2.5 rounded-full ${b.dot}`} />
              <p className="text-sm font-medium text-slate-700">{b.label}</p>
            </div>
            <p className={`text-3xl font-bold ${b.text}`}>{b.remaining}</p>
            <p className="mt-1 text-xs text-slate-500">Remaining</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Leave Type', 'From', 'To', 'Reason', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((leave) => (
                <tr key={leave.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeColor(leave.type)}`}>{leave.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{leave.from}</td>
                  <td className="px-6 py-4 text-slate-600">{leave.to}</td>
                  <td className="px-6 py-4 text-slate-600">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(leave.status)}`}>{leave.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No leave requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoCalendarOutline size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Apply Leave</h2>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              {/* Leave Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Leave Type</label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select leave type</option>
                  <option value="Casual">Casual</option>
                  <option value="Sick">Sick</option>
                  <option value="Earned">Earned</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.type}</p>
                )}
              </div>

              {/* From & To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">From</label>
                  <input
                    name="from"
                    type="date"
                    value={formik.values.from}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.from && formik.errors.from && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.from}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">To</label>
                  <input
                    name="to"
                    type="date"
                    value={formik.values.to}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.to && formik.errors.to && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.to}</p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
                <textarea
                  name="reason"
                  rows={2}
                  placeholder="Brief reason for leave..."
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.reason && formik.errors.reason && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.reason}</p>
                )}
              </div>

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
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
const LeaveRequestsPage = () => {
  const { user } = useAuth()

  return (
    <MainLayout>
      {user?.role === 'employee' ? <EmployeeLeaveView /> : <AdminLeaveView />}
    </MainLayout>
  )
}

export default LeaveRequestsPage
