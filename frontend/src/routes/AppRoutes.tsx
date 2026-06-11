import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/auth/Login'
import SignUp from '../pages/auth/SignUp'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard'
import ManagerDashboard from '../pages/dashboard/ManagerDashboard'
import EmployeesPage from '../pages/employees/EmployeesPage'
import ProjectsPage from '../pages/projects/ProjectsPage'
import AllocationsPage from '../pages/allocations/AllocationsPage'
import LeaveRequestsPage from '../pages/leave/LeaveRequestsPage'
import TimesheetsPage from '../pages/timesheets/TimesheetsPage'
import AvailabilityPage from '../pages/availability/AvailabilityPage'
import ReportsPage from '../pages/reports/ReportsPage'
import ProfilePage from '../pages/profile/Profile'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

const AppRoutes = () => {
  const auth = useAuth()
  const defaultDashboard = auth.user ? `/${auth.user.role}` : '/login'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <RoleRoute requiredRole="manager">
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <RoleRoute requiredRole="employee">
              <EmployeeDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute requiredRole="admin">
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Accessible to all authenticated users */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/allocations"
        element={
          <ProtectedRoute>
            <AllocationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave-requests"
        element={
          <ProtectedRoute>
            <LeaveRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <LeaveRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timesheets"
        element={
          <ProtectedRoute>
            <TimesheetsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <AvailabilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to={defaultDashboard} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
