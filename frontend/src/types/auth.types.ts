export type UserRole = 'employee' | 'manager' | 'admin'

export interface AuthUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isVerified: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'employee' | 'manager'
}

export interface LoginResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  data: AuthUser
  message: string
}

export interface RegisterResponse {
  success: boolean
  data: AuthUser
  message: string
}

export interface AuthContextType {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  login: (payload: LoginRequest) => Promise<AuthUser>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => void
}
