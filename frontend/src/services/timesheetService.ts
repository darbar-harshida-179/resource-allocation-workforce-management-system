import api from './api'

export const getTimesheets = async () => {
  const res = await api.get('/timesheets')
  return res.data
}

export const getMyTimesheets = async () => {
  const res = await api.get('/timesheets/my')
  return res.data
}

export const submitTimesheet = async (data: any) => {
  const res = await api.post('/timesheets', data)
  return res.data
}

export const approveTimesheet = async (id: string) => {
  const res = await api.put(`/timesheets/${id}/approve`)
  return res.data
}

export const rejectTimesheet = async (id: string) => {
  const res = await api.put(`/timesheets/${id}/reject`)
  return res.data
}

export const getWeeklySummary = async () => {
  const res = await api.get('/timesheets/weekly-summary')
  return res.data
}

export const getMonthlySummary = async () => {
  const res = await api.get('/timesheets/monthly-summary')
  return res.data
}
