import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const SignUp = () => {
    const navigate = useNavigate()
    const auth = useAuth()

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'employee',
    }

    const validationSchema = Yup.object({
        firstName: Yup.string().trim().required('First name is required'),
        lastName: Yup.string().trim().required('Last name is required'),
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        role: Yup.string().oneOf(['manager', 'employee'], 'Select a valid role').required('Role is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await auth.register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    role: values.role as 'manager' | 'employee',
                })
                toast.success('Registration successful. Please login to continue.')
                resetForm()
                navigate('/login')
            } catch (error: any) {
                const message = error?.response?.data?.message || 'Registration failed. Please try again.'
                toast.error(message)
                resetForm()
            } finally {
                setSubmitting(false)
            }
        },
    })
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg rounded-[32px] bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold text-indigo-600">Create account</h1>
                    <p className="mt-3 text-sm text-slate-500">Start with your account and choose the right role for your team.</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="firstName">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter Your Firstname"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <p className="mt-2 text-xs text-red-600">{formik.errors.firstName}</p>
                            ) : null}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="lastName">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter Your Lastname"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <p className="mt-2 text-xs text-red-600">{formik.errors.lastName}</p>
                            ) : null}
                        </div>
                    </div>
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <p className="mt-2 text-xs text-red-600">{formik.errors.password}</p>
                            ) : null}
                        </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="role">
                            Select role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none "
                        >
                            <option value="">Select Role</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </select>
                        {formik.touched.role && formik.errors.role ? (
                            <p className="mt-2 text-xs text-red-600">{formik.errors.role}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        {formik.isSubmitting ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer outline-none "
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    )
}

export default SignUp
