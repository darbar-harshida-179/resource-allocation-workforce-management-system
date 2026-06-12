import api from './api'

export const getAllEmployees = async () => {
  const res = await api.get('/employees')
  return res.data
}

export const updateEmployee = async (id: string, data: any) => {
  const res = await api.put(`/employees/${id}`, data)
  return res.data
}

export const searchEmployees = async (keyword: string) => {
  const res = await api.get(`/employees/search?keyword=${keyword}`)
  return res.data
}

export const addSkills = async (id: string, skills: string[]) => {
  const res = await api.put(`/employees/${id}/skills`, { skills })
  return res.data
}

export const assignDepartment = async (id: string, department: string) => {
  const res = await api.put(`/employees/${id}/department`, { department })
  return res.data
}

export const getManagers = async () => {
  const res = await api.get('/employees/managers')
  return res.data
}
