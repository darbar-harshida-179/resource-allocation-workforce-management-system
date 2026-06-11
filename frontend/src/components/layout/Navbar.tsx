import { useAuth } from '../../context/AuthContext'
import { IoMenu } from 'react-icons/io5'

interface NavbarProps {
  onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const auth = useAuth()

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:inline-flex"
          >
            <IoMenu size={24} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
            <p className="text-sm text-slate-500">{formattedDate}</p>
          </div>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-900">
              {auth.user?.firstName} {auth.user?.lastName}
            </p>
            <p className="text-xs text-slate-500 capitalize">{auth.user?.role}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {auth.user?.firstName?.[0]}
            {auth.user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
