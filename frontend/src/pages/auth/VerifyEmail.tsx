import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyEmail } from '../../services/authService'

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error('Invalid verification link')
        navigate('/login')
        return
      }

      try {
        await verifyEmail(token)
        setVerified(true)
        toast.success('Email verified successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Email verification failed'
        toast.error(message)
        setVerified(false)
        setTimeout(() => navigate('/login'), 2000)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl text-center">
        {loading ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Verifying Email</h2>
            <p className="mt-3 text-sm text-slate-600">Please wait while we verify your email address...</p>
          </>
        ) : verified ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Email Verified!</h2>
            <p className="mt-3 text-sm text-slate-600">Your email has been verified successfully. Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Verification Failed</h2>
            <p className="mt-3 text-sm text-slate-600">The verification link is invalid or has expired. Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
