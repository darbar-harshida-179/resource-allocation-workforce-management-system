import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const auth = useAuth()

    const initialValues = {
        email: '',
        password: '',
    }

    const validationSchema = Yup.object({
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const loggedUser = await auth.login(values)
                toast.success('Login successful')
                resetForm()
                const destination = loggedUser.role ? `/${loggedUser.role}` : '/'
                navigate(destination)
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Login failed. Please try again.'
                toast.error(message)
            } finally {
                setSubmitting(false)
            }
        },
    })
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen  bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-[32px] bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold text-indigo-600">Login</h1>
                    <p className="mt-3 text-sm text-slate-500">Access your account and continue to your dashboard.</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter Your Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <p className="mt-2 text-xs text-red-600">{formik.errors.email}</p>
                        ) : null}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                placeholder="Enter Your Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500  cursor-pointer outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <p className="mt-2 text-xs text-red-600">{formik.errors.password}</p>
                        ) : null}
                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700  cursor-pointer  outline-none"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 outline-none"
                    >
                        {formik.isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    New user?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer outline-none"
                    >
                        Signup
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
