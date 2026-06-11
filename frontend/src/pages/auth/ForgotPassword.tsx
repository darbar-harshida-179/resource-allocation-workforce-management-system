import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { forgotPassword } from '../../services/authService'
import { IoArrowBack } from "react-icons/io5";

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
        toast.success('If that email exists, a reset link has been sent.')
        navigate('/login')
        resetForm()
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to send reset link.'
        toast.error(message)
        resetForm()
      } finally {
        setSubmitting(false)
        resetForm()
      }
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl">
        <button onClick={() => navigate('/login')} className="mb-4 text-sm text-indigo-600 cursor-pointer outline-none"><IoArrowBack size={25}/>
</button>
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 00-8 0v4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v2m0 4v.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-indigo-600">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-2 text-xs text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer outline-none transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
