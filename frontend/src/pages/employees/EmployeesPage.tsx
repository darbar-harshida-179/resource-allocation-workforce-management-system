import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import { IoSearch, IoPencil, IoTrash, IoClose, IoPersonAdd } from 'react-icons/io5'

interface Employee {
  id: number
  name: string
  email: string
  department: string
  skills: string[]
  status: string
}

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Backend', 'Frontend', 'DevOps', 'HR', 'Management']

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Rohan Mehta', email: 'rohan@company.com', department: 'Engineering', skills: ['React', 'Node.js'], status: 'Active' },
    { id: 2, name: 'Ananya Patel', email: 'ananya@company.com', department: 'Design', skills: ['Figma', 'CSS'], status: 'Active' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@company.com', department: 'Engineering', skills: ['Python', 'ML'], status: 'Active' },
    { id: 4, name: 'Neha Gupta', email: 'neha@company.com', department: 'QA', skills: ['Selenium', 'Jest'], status: 'Inactive' },
    { id: 5, name: 'Arjun Nair', email: 'arjun@company.com', department: 'Backend', skills: ['Java', 'Spring'], status: 'Active' },
  ])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      skills: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      department: Yup.string().required('Department is required'),
      skills: Yup.string().trim().required('At least one skill is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const newEmployee: Employee = {
        id: employees.length + 1,
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        department: values.department,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active',
      }
      setEmployees((prev) => [...prev, newEmployee])
      resetForm()
      setShowModal(false)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setShowModal(false)
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Employee Management</h1>
            <p className="mt-1 text-sm text-slate-600">{employees.length} total employees</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <IoPersonAdd size={18} />
            Add Employee
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Skills</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{emp.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {emp.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">
                          <IoPencil size={16} />
                        </button>
                        <button
                          onClick={() => setEmployees((prev) => prev.filter((e) => e.id !== emp.id))}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <IoTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-slate-500">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoPersonAdd size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Add Employee</h2>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <IoClose size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                <select
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {formik.touched.department && formik.errors.department && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.department}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills <span className="font-normal text-slate-400">(comma separated)</span></label>
                <input
                  name="skills"
                  type="text"
                  placeholder="React.js, Node.js, TypeScript"
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.skills && formik.errors.skills && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.skills}</p>
                )}
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default EmployeesPage
