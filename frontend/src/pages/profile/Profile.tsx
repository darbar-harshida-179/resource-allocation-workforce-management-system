import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import { IoPersonCircle } from 'react-icons/io5'

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Backend', 'Frontend', 'DevOps', 'HR', 'Management']

const ProfilePage = () => {
  const { user } = useAuth()

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      department: 'Engineering',
      skills: 'React, Node.js, Python',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      department: Yup.string().required('Department is required'),
      skills: Yup.string().trim().required('Skills are required'),
    }),
    onSubmit: (_values, { setSubmitting }) => {
      setTimeout(() => {
        toast.success('Profile updated successfully')
        setSubmitting(false)
      }, 600)
    },
  })

  return (
    <MainLayout>
      <div className="space-y-2 px-4 py-6 sm:px-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information</p>
        </div>

        {/* Two Cards Side by Side */}
        <div className="grid gap-6 lg:grid-cols-2 lg:max-w-4xl">

          {/* Card 1 — Avatar + Stats */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md">
            {/* Avatar circle */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-lg">
              {initials}
            </div>

            {/* Name & Role */}
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <IoPersonCircle size={16} className="text-indigo-500" />
              <span className="text-sm font-medium capitalize text-indigo-600">{user?.role}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>

            {/* Divider */}
            <div className="my-4 h-px w-full bg-slate-100" />

            {/* Stats */}
            <div className="flex w-full justify-around">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">2</p>
                <p className="mt-0.5 text-xs text-slate-500">Projects</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="text-center">
                <p className="text-xl font-bold text-indigo-600">100%</p>
                <p className="mt-0.5 text-xs text-slate-500">Utilization</p>
              </div>
            </div>
          </div>

          {/* Card 2 — Personal Information Form */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <h3 className="mb-5 text-base font-semibold text-slate-900">Personal Information</h3>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">First Name</label>
                  <input
                    name="firstName"
                    type="text"
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
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
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
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Email</label>
                <input
                  name="email"
                  type="email"
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
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Department</label>
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
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Skills</label>
                <input
                  name="skills"
                  type="text"
                  placeholder="React, Node.js, Python"
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.skills && formik.errors.skills && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.skills}</p>
                )}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
              >
                {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
