import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth.types'
import { IoMenu, IoClose, IoLogOut } from 'react-icons/io5'
import LogoutModal from '../common/LogoutModal'

interface NavItem {
  label: string
  path: string
  icon: string
}

const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Employees', path: '/employees', icon: '👥' },
    { label: 'Projects', path: '/projects', icon: '📁' },
    { label: 'Allocations', path: '/allocations', icon: '⏰' },
    { label: 'Leave Requests', path: '/leave-requests', icon: '🗓️' },
    { label: 'Timesheets', path: '/timesheets', icon: '📋' },
    { label: 'Availability', path: '/availability', icon: '📍' },
    { label: 'Reports', path: '/reports', icon: '📈' },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager', icon: '📊' },
    { label: 'My Projects', path: '/my-projects', icon: '📁' },
    { label: 'Allocations', path: '/allocations', icon: '⏰' },
    { label: 'Timesheets', path: '/timesheets', icon: '📋' },
    { label: 'Leave Requests', path: '/leave-requests', icon: '🗓️' },
    { label: 'Availability', path: '/availability', icon: '📍' },
    { label: 'Reports', path: '/reports', icon: '📈' },
  ],
  employee: [
    { label: 'Dashboard', path: '/employee', icon: '📊' },
    { label: 'My Projects', path: '/my-projects', icon: '📁' },
    { label: 'Timesheets', path: '/timesheets', icon: '📋' },
    { label: 'Leave', path: '/leave', icon: '🗓️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
}

interface SidebarProps {
  onClose?: () => void
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const auth = useAuth()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  if (!auth.user) return null

  const userRole = auth.user.role as UserRole
  const navItems = ROLE_NAV_ITEMS[userRole] || []

  const isActive = (path: string) => location.pathname === path

  const handleNavClick = () => {
    setIsMobileOpen(false)
    onClose?.()
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-indigo-600 p-2 text-white md:hidden"
      >
        {isMobileOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-slate-700 px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold">
              W
            </div>
            <h1 className="text-xl font-bold">WorkForce</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
              {auth.user.firstName?.[0]}
              {auth.user.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                {auth.user.firstName} {auth.user.lastName}
              </p>
              <p className="text-xs text-slate-400 capitalize">{auth.user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 px-4 py-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <IoLogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
