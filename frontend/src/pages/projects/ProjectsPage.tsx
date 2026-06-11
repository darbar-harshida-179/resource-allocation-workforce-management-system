import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from '../../components/layout/MainLayout'
import { IoPencil, IoTrash, IoClose, IoFolderOpen } from 'react-icons/io5'

interface Project {
  id: number
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
  progress: number
  resources: number
}

const STATUS_OPTIONS = ['Planning', 'In Progress', 'On Hold', 'Completed']

const statusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'bg-blue-100 text-blue-700'
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'On Hold': return 'bg-red-100 text-red-700'
    default: return 'bg-purple-100 text-purple-700'
  }
}

const ProjectsPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Project Alpha', description: 'E-commerce platform rebuild', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-08-31', progress: 60, resources: 2 },
    { id: 2, name: 'Project Beta', description: 'Internal HR portal', status: 'In Progress', startDate: '2026-02-01', endDate: '2026-07-31', progress: 40, resources: 2 },
    { id: 3, name: 'Project Gamma', description: 'Mobile app development', status: 'Completed', startDate: '2025-10-01', endDate: '2026-03-31', progress: 100, resources: 0 },
    { id: 4, name: 'Project Delta', description: 'Data analytics dashboard', status: 'Planning', startDate: '2026-04-01', endDate: '2026-12-31', progress: 0, resources: 1 },
  ])

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: '',
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: (values, { resetForm }) => {
      const newProject: Project = {
        id: projects.length + 1,
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        progress: values.status === 'Completed' ? 100 : values.status === 'Planning' ? 0 : 10,
        resources: 0,
      }
      setProjects((prev) => [...prev, newProject])
      resetForm()
      setShowModal(false)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setShowModal(false)
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <IoFolderOpen size={18} />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">
                    <IoPencil size={16} />
                  </button>
                  <button
                    onClick={() => setProjects((prev) => prev.filter((p) => p.id !== project.id))}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <IoTrash size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-3">
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Resources</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{project.resources}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-600">Progress</p>
                  <p className="text-xs font-semibold text-slate-900">{project.progress}%</p>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-indigo-600 transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <p className="text-xs text-slate-400">{project.startDate} — {project.endDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                  <IoFolderOpen size={18} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">New Project</h2>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
                <IoClose size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              {/* Project Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Project Alpha"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Brief project description..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.description}</p>
                )}
              </div>

              {/* Start & End Date */}
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
                  {formik.touched.startDate && formik.errors.startDate && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.startDate}</p>
                  )}
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
                  {formik.touched.endDate && formik.errors.endDate && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Status */}
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
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {formik.touched.status && formik.errors.status && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.status}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default ProjectsPage
