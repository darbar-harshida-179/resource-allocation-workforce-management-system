import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IoEye, IoEyeOff, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const loggedUser = await auth.login(values)
        toast.success('Login successful')
        resetForm()
        navigate(`/${loggedUser.role}`)
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Login failed. Please try again.'
        toast.error(message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <IoLockClosedOutline size={26} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="email" type="email" placeholder="Enter your email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {formik.touched.email && formik.errors.email && <p className="mt-1.5 text-xs text-red-500">{formik.errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && <p className="mt-1.5 text-xs text-red-500">{formik.errors.password}</p>}
            <div className="mt-2 text-right">
              <button type="button" onClick={() => navigate('/forgot-password')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" disabled={formik.isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New user?{' '}
          <button onClick={() => navigate('/signup')} className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create account
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
