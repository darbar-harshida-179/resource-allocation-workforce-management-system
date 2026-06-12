import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IoEye, IoEyeOff, IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoPeopleOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const SignUp = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '', role: 'employee' },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
      role: Yup.string().oneOf(['manager', 'employee']).required('Role is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await auth.register({
          firstName: values.firstName, lastName: values.lastName,
          email: values.email, password: values.password,
          role: values.role as 'manager' | 'employee',
        })
        toast.success('Registration successful! Please check your email to verify.')
        resetForm()
        navigate('/login')
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const inputClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <IoPeopleOutline size={26} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Join your team and get started</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input name="firstName" type="text" placeholder="John"
                  value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  className={inputClass} />
              </div>
              {formik.touched.firstName && formik.errors.firstName && <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input name="lastName" type="text" placeholder="Doe"
                  value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  className={inputClass} />
              </div>
              {formik.touched.lastName && formik.errors.lastName && <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input name="email" type="email" placeholder="john@company.com"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={inputClass} />
            </div>
            {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                {showPassword ? <IoEyeOff size={17} /> : <IoEye size={17} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
            <div className="relative">
              <IoPeopleOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <select name="role" value={formik.values.role} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                <option value="">Select role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            {formik.touched.role && formik.errors.role && <p className="mt-1 text-xs text-red-500">{formik.errors.role}</p>}
          </div>

          <button type="submit" disabled={formik.isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
            {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignUp
