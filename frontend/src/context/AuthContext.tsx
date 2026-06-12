import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, registerUser, logoutUser } from '../services/authService'
import type {
  AuthContextType,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_KEY = 'resource-allocation-auth-user'
const AUTH_TOKEN_KEY = 'resource-allocation-auth-token'
const AUTH_REFRESH_KEY = 'resource-allocation-refresh-token'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY)
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(AUTH_USER_KEY)
      }
    }

    if (savedToken) {
      setAccessToken(savedToken)
    }

    setLoading(false)
  }, [])

  const handleLogin = async (payload: LoginRequest) => {
    const response = await loginUser(payload)
    setUser(response.data)
    setAccessToken(response.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data))
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken)
    localStorage.setItem(AUTH_REFRESH_KEY, response.refreshToken)
    return response.data
  }

  const handleRegister = async (payload: RegisterRequest) => {
    await registerUser(payload)
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(AUTH_REFRESH_KEY)
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } catch {
      // Silently ignore logout API errors
    } finally {
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_REFRESH_KEY)
    }
  }

  const value = useMemo(
    () => ({ user, accessToken, loading, login: handleLogin, register: handleRegister, logout }),
    [user, accessToken, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
