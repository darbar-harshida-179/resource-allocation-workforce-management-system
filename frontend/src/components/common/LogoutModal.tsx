import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-900">Sign Out</h2>
        <p className="mt-2 text-sm text-slate-600">Are you sure you want to sign out?</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            No
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
