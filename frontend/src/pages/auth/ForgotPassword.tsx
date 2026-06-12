import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IoArrowBack, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5'
import { forgotPassword } from '../../services/authService'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await forgotPassword({ email: values.email })
        toast.success('Reset link sent! Please check your email.')
        resetForm()
        navigate('/login')
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to send reset link.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        {/* Back button */}
        <button onClick={() => navigate('/login')}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-700">
          <IoArrowBack size={18} />
          Back to login
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <IoLockClosedOutline size={26} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
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

          <button type="submit" disabled={formik.isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
