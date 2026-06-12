import { type ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <Navbar onMobileMenuClick={() => setMobileOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
