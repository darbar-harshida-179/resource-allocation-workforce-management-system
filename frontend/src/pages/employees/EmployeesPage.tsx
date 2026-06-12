import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import {
  IoSearch, IoPencil, IoClose, IoPersonAdd,
  IoMailOutline, IoLockClosedOutline, IoPersonOutline,
  IoBriefcaseOutline, IoCodeSlashOutline, IoEye, IoEyeOff,
} from 'react-icons/io5'

interface Employee {
  id: number
  name: string
  email: string
  department: string
  skills: string[]
  status: string
}

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Backend', 'Frontend', 'DevOps', 'HR', 'Management']

const ic = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Rohan Mehta', email: 'rohan@company.com', department: 'Engineering', skills: ['React', 'Node.js'], status: 'Active' },
    { id: 2, name: 'Ananya Patel', email: 'ananya@company.com', department: 'Design', skills: ['Figma', 'CSS'], status: 'Active' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@company.com', department: 'Engineering', skills: ['Python', 'ML'], status: 'Active' },
    { id: 4, name: 'Neha Gupta', email: 'neha@company.com', department: 'QA', skills: ['Selenium', 'Jest'], status: 'Inactive' },
    { id: 5, name: 'Arjun Nair', email: 'arjun@company.com', department: 'Backend', skills: ['Java', 'Spring'], status: 'Active' },
  ])

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '', department: '', skills: '' },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
      department: Yup.string().required('Department is required'),
      skills: Yup.string().trim().required('At least one skill is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setEmployees((prev) => [...prev, {
        id: Date.now(),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        department: values.department,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active',
      }])
      resetForm()
      setShowPassword(false)
      setShowModal(false)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setShowPassword(false)
    setShowModal(false)
  }

  // Edit formik
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: editEmployee?.name.split(' ')[0] ?? '',
      lastName: editEmployee?.name.split(' ').slice(1).join(' ') ?? '',
      email: editEmployee?.email ?? '',
      department: editEmployee?.department ?? '',
      skills: editEmployee?.skills.join(', ') ?? '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      department: Yup.string().required('Department is required'),
      skills: Yup.string().trim().required('At least one skill is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setEmployees(prev => prev.map(e =>
        e.id === editEmployee!.id
          ? { ...e, name: `${values.firstName} ${values.lastName}`, email: values.email, department: values.department, skills: values.skills.split(',').map(s => s.trim()).filter(Boolean) }
          : e
      ))
      resetForm()
      setEditEmployee(null)
    },
  })

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="space-y-5 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Employee Management</h1>
            <p className="mt-1 text-sm text-slate-500">{employees.length} total employees</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto">
            <IoPersonAdd size={18} />
            Add Employee
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input type="text" placeholder="Search employees..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>

        {/* Table — scrollable on mobile */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {['Employee', 'Department', 'Skills', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 sm:px-6">{emp.department}</td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.map((s) => (
                          <span key={s} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <button onClick={() => setEditEmployee(emp)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-50">
                        <IoPencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoPersonAdd size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Add Employee</h2>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={16} />
                    <input name="firstName" type="text" placeholder="John"
                      value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={inp} />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={16} />
                    <input name="lastName" type="text" placeholder="Doe"
                      value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={inp} />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <IoMailOutline className={ic} size={16} />
                  <input name="email" type="email" placeholder="john@company.com"
                    value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={inp} />
                </div>
                {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <IoLockClosedOutline className={ic} size={16} />
                  <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                <div className="relative">
                  <IoBriefcaseOutline className={ic} size={16} />
                  <select name="department" value={formik.values.department}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={inp}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {formik.touched.department && formik.errors.department && <p className="mt-1 text-xs text-red-500">{formik.errors.department}</p>}
              </div>

              {/* Skills */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Skills <span className="font-normal text-slate-400">(comma separated)</span>
                </label>
                <div className="relative">
                  <IoCodeSlashOutline className={ic} size={16} />
                  <input name="skills" type="text" placeholder="React.js, Node.js, TypeScript"
                    value={formik.values.skills} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className={inp} />
                </div>
                {formik.touched.skills && formik.errors.skills && <p className="mt-1 text-xs text-red-500">{formik.errors.skills}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={formik.isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Employee Modal */}
      {editEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoPencil size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
              </div>
              <button onClick={() => setEditEmployee(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>
            <form onSubmit={editFormik.handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={16} />
                    <input name="firstName" type="text" value={editFormik.values.firstName} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} className={inp} />
                  </div>
                  {editFormik.touched.firstName && editFormik.errors.firstName && <p className="mt-1 text-xs text-red-500">{editFormik.errors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={16} />
                    <input name="lastName" type="text" value={editFormik.values.lastName} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} className={inp} />
                  </div>
                  {editFormik.touched.lastName && editFormik.errors.lastName && <p className="mt-1 text-xs text-red-500">{editFormik.errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <IoMailOutline className={ic} size={16} />
                  <input name="email" type="email" value={editFormik.values.email} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} className={inp} />
                </div>
                {editFormik.touched.email && editFormik.errors.email && <p className="mt-1 text-xs text-red-500">{editFormik.errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                <div className="relative">
                  <IoBriefcaseOutline className={ic} size={16} />
                  <select name="department" value={editFormik.values.department} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} className={inp}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {editFormik.touched.department && editFormik.errors.department && <p className="mt-1 text-xs text-red-500">{editFormik.errors.department}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills <span className="font-normal text-slate-400">(comma separated)</span></label>
                <div className="relative">
                  <IoCodeSlashOutline className={ic} size={16} />
                  <input name="skills" type="text" value={editFormik.values.skills} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} className={inp} />
                </div>
                {editFormik.touched.skills && editFormik.errors.skills && <p className="mt-1 text-xs text-red-500">{editFormik.errors.skills}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditEmployee(null)} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={editFormik.isSubmitting} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default EmployeesPage
