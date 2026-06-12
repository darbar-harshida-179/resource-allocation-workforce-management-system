import api from './api'

export const getProjects = async () => {
  const res = await api.get('/projects')
  return res.data
}

export const getProjectById = async (id: string) => {
  const res = await api.get(`/projects/${id}`)
  return res.data
}

export const createProject = async (data: any) => {
  const res = await api.post('/projects', data)
  return res.data
}

export const updateProject = async (id: string, data: any) => {
  const res = await api.put(`/projects/${id}`, data)
  return res.data
}

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`)
  return res.data
}

export const closeProject = async (id: string) => {
  const res = await api.put(`/projects/${id}/close`)
  return res.data
}

export const getAssignedResources = async (id: string) => {
  const res = await api.get(`/projects/${id}/resources`)
  return res.data
}
