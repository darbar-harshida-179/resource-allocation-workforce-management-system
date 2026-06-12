import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import MainLayout from '../../components/layout/MainLayout'
import { IoPencil, IoTrash, IoClose, IoFolderOpen, IoWarningOutline, IoReloadOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { getProjects, createProject, updateProject, deleteProject as deleteProjectApi } from '../../services/projectService'
import { getManagers } from '../../services/employeeService'

interface Manager {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface Project {
  _id: string
  projectName: string
  description: string
  status: string
  startDate: string
  endDate: string
  resourcesCount?: number
  manager?: Manager
}

const STATUS_OPTIONS = ['planning', 'in-progress', 'on-hold', 'completed']

const statusColor = (status: string) => {
  switch (status) {
    case 'in-progress': return 'bg-blue-100 text-blue-700'
    case 'completed': return 'bg-green-100 text-green-700'
    case 'on-hold': return 'bg-red-100 text-red-700'
    default: return 'bg-purple-100 text-purple-700'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'in-progress': return 'In Progress'
    case 'completed': return 'Completed'
    case 'on-hold': return 'On Hold'
    default: return 'Planning'
  }
}

const formFields = (formik: any, managers: Manager[]) => (
  <div className="space-y-4">
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Name</label>
      <input
        name="name"
        type="text"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      {formik.touched.name && formik.errors.name && <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>}
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
      <textarea
        name="description"
        rows={2}
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      {formik.touched.description && formik.errors.description && <p className="mt-1 text-xs text-red-500">{formik.errors.description}</p>}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
        <input
          name="startDate"
          type="date"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {formik.touched.startDate && formik.errors.startDate && <p className="mt-1 text-xs text-red-500">{formik.errors.startDate}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
        <input
          name="endDate"
          type="date"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {formik.touched.endDate && formik.errors.endDate && <p className="mt-1 text-xs text-red-500">{formik.errors.endDate}</p>}
      </div>
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
      <select
        name="status"
        value={formik.values.status}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select status</option>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
      </select>
      {formik.touched.status && formik.errors.status && <p className="mt-1 text-xs text-red-500">{formik.errors.status}</p>}
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Manager</label>
      <select
        name="manager"
        value={formik.values.manager}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select manager</option>
        {managers.map((m) => (
          <option key={m._id} value={m._id}>
            {m.firstName} {m.lastName}
          </option>
        ))}
      </select>
      {formik.touched.manager && formik.errors.manager && <p className="mt-1 text-xs text-red-500">{formik.errors.manager}</p>}
    </div>
  </div>
)

const validationSchema = Yup.object({
  name: Yup.string().trim().required('Project name is required'),
  description: Yup.string().trim().required('Description is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string()
    .required('End date is required')
    .test('is-after', 'End date must be after start date', function (value) {
      const { startDate } = this.parent
      return !startDate || !value || value > startDate
    }),
  status: Yup.string().required('Status is required'),
  manager: Yup.string().required('Manager is required'),
})

// ── Employee read-only view ──
const EmployeeProjectsView = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Projects</h1>
        <p className="mt-1 text-sm text-slate-500">You are assigned to {projects.length} projects</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="font-semibold text-slate-900">{project.projectName}</h3>
              <p className="mt-1 text-sm text-slate-500">{project.description}</p>
            </div>

            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(project.status)}`}>
              {statusLabel(project.status)}
            </span>

            <p className="mt-3 text-xs text-slate-400">
              {new Date(project.startDate).toLocaleDateString()} → {new Date(project.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-slate-400 col-span-full">No projects found.</p>
        )}
      </div>
    </div>
  )
}

// ── Admin/Manager full view ──
const ProjectsPage = () => {
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjectsList = async () => {
    try {
      setLoading(true)
      const res = await getProjects()
      setProjects(res.data || [])
    } catch {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchManagersList = async () => {
    try {
      const res = await getManagers()
      setManagers(res.data || [])
    } catch {
      toast.error('Failed to fetch managers')
    }
  }

  useEffect(() => {
    fetchProjectsList()
    fetchManagersList()
  }, [])

  // ── Add formik ──
  const addFormik = useFormik({
    initialValues: { name: '', description: '', startDate: '', endDate: '', status: '', manager: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createProject({
          projectName: values.name,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          manager: values.manager,
        })
        toast.success('Project created successfully')
        resetForm()
        setShowAddModal(false)
        fetchProjectsList()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to create project')
      }
    },
  })

  // ── Edit formik ──
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editProject?.projectName ?? '',
      description: editProject?.description ?? '',
      startDate: editProject?.startDate ? new Date(editProject.startDate).toISOString().split('T')[0] : '',
      endDate: editProject?.endDate ? new Date(editProject.endDate).toISOString().split('T')[0] : '',
      status: editProject?.status ?? '',
      manager: editProject?.manager?._id ?? '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateProject(editProject!._id, {
          projectName: values.name,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          manager: values.manager,
        })
        toast.success('Project updated successfully')
        resetForm()
        setEditProject(null)
        fetchProjectsList()
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update project')
      }
    },
  })

  // ── Delete handler ──
  const handleDelete = async () => {
    try {
      await deleteProjectApi(deleteProject!._id)
      toast.success('Project deleted successfully')
      setDeleteProject(null)
      fetchProjectsList()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete project')
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <IoReloadOutline className="animate-spin text-indigo-500" size={32} />
        </div>
      </MainLayout>
    )
  }

  if (user?.role === 'employee') {
    return <MainLayout><EmployeeProjectsView projects={projects} /></MainLayout>
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Projects</h1>
            <p className="mt-1 text-sm text-slate-600">Manage all active and completed projects</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <IoFolderOpen size={18} />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-slate-900">{project.projectName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditProject(project)}
                    className="rounded-lg p-1.5 text-green-600 transition hover:bg-green-50"
                  >
                    <IoPencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteProject(project)}
                    className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                  >
                    <IoTrash size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Status</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(project.status)}`}>
                    {statusLabel(project.status)}
                  </span>
                </div>
                {project.manager && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Manager</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {project.manager.firstName} {project.manager.lastName}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400">
                {new Date(project.startDate).toLocaleDateString()} — {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full">No projects created yet.</p>
          )}
        </div>
      </div>

      {/* ── Add Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoFolderOpen size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">New Project</h2>
              </div>
              <button onClick={() => { addFormik.resetForm(); setShowAddModal(false) }} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>
            <form onSubmit={addFormik.handleSubmit} className="px-6 py-5">
              {formFields(addFormik, managers)}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => { addFormik.resetForm(); setShowAddModal(false) }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={addFormik.isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoPencil size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Project</h2>
              </div>
              <button onClick={() => setEditProject(null)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>
            <form onSubmit={editFormik.handleSubmit} className="px-6 py-5">
              {formFields(editFormik, managers)}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setEditProject(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={editFormik.isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <IoWarningOutline size={28} className="text-red-600" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Delete Project</h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleteProject.projectName}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteProject(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default ProjectsPage
