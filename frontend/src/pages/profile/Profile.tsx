import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import MainLayout from '../../components/layout/MainLayout'
import { IoPersonCircle, IoPersonOutline, IoMailOutline, IoBriefcaseOutline, IoCodeSlashOutline } from 'react-icons/io5'

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'Backend', 'Frontend', 'DevOps', 'HR', 'Management']
const ic = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const ProfilePage = () => {
  const { user } = useAuth()
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

  const formik = useFormik({
    initialValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '', department: 'Engineering', skills: 'React, Node.js, Python' },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      department: Yup.string().required('Department is required'),
      skills: Yup.string().trim().required('Skills are required'),
    }),
    onSubmit: (_, { setSubmitting }) => {
      setTimeout(() => { toast.success('Profile updated successfully'); setSubmitting(false) }, 600)
    },
  })

  return (
    <MainLayout>
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:max-w-4xl">
          {/* Card 1 */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900">{user?.firstName} {user?.lastName}</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <IoPersonCircle size={16} className="text-indigo-500" />
              <span className="text-sm font-medium capitalize text-indigo-600">{user?.role}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            <div className="my-4 h-px w-full bg-slate-100" />
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

          {/* Card 2 */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Personal Information</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">First Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={15} />
                    <input name="firstName" type="text" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Last Name</label>
                  <div className="relative">
                    <IoPersonOutline className={ic} size={15} />
                    <input name="lastName" type="text" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Email</label>
                <div className="relative">
                  <IoMailOutline className={ic} size={15} />
                  <input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                </div>
                {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Department</label>
                <div className="relative">
                  <IoBriefcaseOutline className={ic} size={15} />
                  <select name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {formik.touched.department && formik.errors.department && <p className="mt-1 text-xs text-red-500">{formik.errors.department}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Skills</label>
                <div className="relative">
                  <IoCodeSlashOutline className={ic} size={15} />
                  <input name="skills" type="text" placeholder="React, Node.js, Python" value={formik.values.skills} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inp} />
                </div>
                {formik.touched.skills && formik.errors.skills && <p className="mt-1 text-xs text-red-500">{formik.errors.skills}</p>}
              </div>

              <button type="submit" disabled={formik.isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70">
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
