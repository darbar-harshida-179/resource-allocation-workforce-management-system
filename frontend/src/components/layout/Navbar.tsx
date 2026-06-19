import { useAuth } from '../../context/AuthContext'
import { IoMenu } from 'react-icons/io5'

interface NavbarProps {
  onMobileMenuClick?: () => void
}

const Navbar = ({ onMobileMenuClick }: NavbarProps) => {
  const auth = useAuth()

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        {/* Left — mobile hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            <IoMenu size={22} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Dashboard</h2>
            <p className="hidden text-xs text-slate-500 sm:block">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {auth.user?.firstName} {auth.user?.lastName}
            </p>
            <p className="text-xs capitalize text-slate-500">{auth.user?.role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {auth.user?.firstName?.[0]}{auth.user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
