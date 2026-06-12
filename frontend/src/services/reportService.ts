import api from './api'

export const getUtilizationReport = async () => {
  const res = await api.get('/reports/utilization')
  return res.data
}

export const getProjectReport = async () => {
  const res = await api.get('/reports/projects')
  return res.data
}

export const getLeaveReport = async () => {
  const res = await api.get('/reports/leaves')
  return res.data
}
