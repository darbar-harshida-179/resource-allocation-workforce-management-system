import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth.types'
import {
  IoMenu, IoLogOut,
  IoGridOutline, IoPeopleOutline, IoFolderOutline, IoLayersOutline,
  IoCalendarOutline, IoDocumentTextOutline, IoLocationOutline, IoBarChartOutline, IoPersonOutline,
} from 'react-icons/io5'
import LogoutModal from '../common/LogoutModal'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: <IoGridOutline size={18} /> },
    { label: 'Employees', path: '/employees', icon: <IoPeopleOutline size={18} /> },
    { label: 'Projects', path: '/projects', icon: <IoFolderOutline size={18} /> },
    { label: 'Allocations', path: '/allocations', icon: <IoLayersOutline size={18} /> },
    { label: 'Leave Requests', path: '/leave-requests', icon: <IoCalendarOutline size={18} /> },
    { label: 'Timesheets', path: '/timesheets', icon: <IoDocumentTextOutline size={18} /> },
    { label: 'Availability', path: '/availability', icon: <IoLocationOutline size={18} /> },
    { label: 'Reports', path: '/reports', icon: <IoBarChartOutline size={18} /> },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager', icon: <IoGridOutline size={18} /> },
    { label: 'Allocations', path: '/allocations', icon: <IoLayersOutline size={18} /> },
    { label: 'Timesheets', path: '/timesheets', icon: <IoDocumentTextOutline size={18} /> },
    { label: 'Leave Requests', path: '/leave-requests', icon: <IoCalendarOutline size={18} /> },
    { label: 'Availability', path: '/availability', icon: <IoLocationOutline size={18} /> },
    { label: 'Reports', path: '/reports', icon: <IoBarChartOutline size={18} /> },
  ],
  employee: [
    { label: 'Dashboard', path: '/employee', icon: <IoGridOutline size={18} /> },
    { label: 'My Projects', path: '/my-projects', icon: <IoFolderOutline size={18} /> },
    { label: 'Timesheets', path: '/timesheets', icon: <IoDocumentTextOutline size={18} /> },
    { label: 'Leave', path: '/leave', icon: <IoCalendarOutline size={18} /> },
    { label: 'Profile', path: '/profile', icon: <IoPersonOutline size={18} /> },
  ],
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const auth = useAuth()
  const location = useLocation()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  if (!auth.user) return null

  const userRole = auth.user.role as UserRole
  const navItems = ROLE_NAV_ITEMS[userRole] || []
  const isActive = (path: string) => location.pathname === path
  const initials = `${auth.user.firstName?.[0] ?? ''}${auth.user.lastName?.[0] ?? ''}`

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-900 text-slate-100 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header — hamburger replaces W when collapsed */}
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-700 px-3">
          {collapsed ? (
            /* collapsed: show only hamburger to expand */
            <button
              onClick={onToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <IoMenu size={22} />
            </button>
          ) : (
            /* expanded: W + WorkForce + hamburger to collapse */
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  W
                </div>
                <h1 className="text-base font-bold text-white">WorkForce</h1>
              </div>
              <button
                onClick={onToggle}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <IoMenu size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Nav — icons only when collapsed, clicking navigates WITHOUT expanding */}
        <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={item.label}
              className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition
                ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}
                ${isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-700 px-3 py-3">
          {collapsed ? (
            <div className="flex justify-center">
              <div
                title={`${auth.user.firstName} ${auth.user.lastName} (${auth.user.role})`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold"
              >
                {initials}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-100">
                  {auth.user.firstName} {auth.user.lastName}
                </p>
                <p className="text-xs capitalize text-slate-400">{auth.user.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="border-t border-slate-700 px-3 py-3">
          {collapsed ? (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Sign out"
              className="flex w-full items-center justify-center rounded-lg bg-slate-800 p-2.5 text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <IoLogOut size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              <IoLogOut size={18} />
              Sign out
            </button>
          )}
        </div>
      </aside>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onMobileClose} />
      )}
    </>
  )
}

export default Sidebar
