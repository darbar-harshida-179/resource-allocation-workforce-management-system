import api from './api'

export const getAllocations = async () => {
  const res = await api.get('/allocations')
  return res.data
}

export const createAllocation = async (data: any) => {
  const res = await api.post('/allocations', data)
  return res.data
}

export const updateAllocation = async (id: string, data: any) => {
  const res = await api.put(`/allocations/${id}`, data)
  return res.data
}

export const deleteAllocation = async (id: string) => {
  const res = await api.delete(`/allocations/${id}`)
  return res.data
}

export const getAllocationHistory = async () => {
  const res = await api.get('/allocations/history')
  return res.data
}
