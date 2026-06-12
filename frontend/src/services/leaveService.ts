import api from './api'

export const getLeaves = async () => {
  const res = await api.get('/leaves')
  return res.data
}

export const getMyLeaves = async () => {
  const res = await api.get('/leaves/my')
  return res.data
}

export const applyLeave = async (data: any) => {
  const res = await api.post('/leaves', data)
  return res.data
}

export const approveLeave = async (id: string) => {
  const res = await api.put(`/leaves/${id}/approve`)
  return res.data
}

export const rejectLeave = async (id: string) => {
  const res = await api.put(`/leaves/${id}/reject`)
  return res.data
}

export const getLeaveCalendar = async () => {
  const res = await api.get('/leaves/calendar')
  return res.data
}
