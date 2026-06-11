import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/auth.types'

const RoleRoute = ({
  requiredRole,
  children,
}: {
  requiredRole: UserRole
  children: ReactNode
}) => {
  const auth = useAuth()

  if (!auth.user) {
    return <Navigate to="/login" replace />
  }

  if (auth.user.role !== requiredRole) {
    return <Navigate to={`/${auth.user.role}`} replace />
  }

  return children
}

export default RoleRoute
