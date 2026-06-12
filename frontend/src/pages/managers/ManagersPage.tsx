import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import MainLayout from '../../components/layout/MainLayout'
import { IoSearch, IoReloadOutline } from 'react-icons/io5'
import { getManagers } from '../../services/employeeService'

interface Manager {
  _id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  role: string
}

const ManagersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)

  const fetchManagersList = async () => {
    try {
      setLoading(true)
      const res = await getManagers()
      setManagers(res.data || [])
    } catch {
      toast.error('Failed to load managers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchManagersList() }, [])

  const filtered = managers.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="space-y-5 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Manager Management</h1>
            <p className="mt-1 text-sm text-slate-500">{managers.length} total managers</p>
          </div>
        </div>

        <div className="relative">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input type="text" placeholder="Search managers..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>{['Manager', 'Status'].map(h =>
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={2} className="py-10 text-center text-sm text-slate-400">
                    <IoReloadOutline className="mx-auto mb-2 animate-spin" size={20} />Loading...
                  </td></tr>
                ) : filtered.map(mgr => (
                  <tr key={mgr._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {mgr.firstName[0]}{mgr.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{mgr.firstName} {mgr.lastName}</p>
                          <p className="text-xs text-slate-400">{mgr.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${mgr.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {mgr.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 &&
                  <tr><td colSpan={2} className="py-10 text-center text-sm text-slate-400">No managers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ManagersPage
