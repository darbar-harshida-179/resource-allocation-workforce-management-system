import api from './api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth.types'

export const loginUser = async (payload: LoginRequest) => {
  const response = await api.post<LoginResponse>('/auth/login', payload)
  return response.data
}

export const registerUser = async (payload: RegisterRequest) => {
  const response = await api.post<RegisterResponse>('/auth/register', payload)
  return response.data
}

export const forgotPassword = async (payload: { email: string }) => {
  const response = await api.post('/auth/forgot-password', payload)
  return response.data
}

export const verifyEmail = async (token: string) => {
  const response = await api.get(`/auth/verify-email/${token}`)
  return response.data
}
