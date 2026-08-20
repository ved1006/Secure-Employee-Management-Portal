import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import RoleRoute from './components/RoleRoute';
import Users from './pages/Users';
import Announcements from './pages/Announcements';
import MyLeaves from './pages/MyLeaves';
import LeaveRequests from './pages/LeaveRequests';
// Helper component to restrict access to authenticated users
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
      //protected routes only **
       <Route path="/" element={<Layout />}>
  <Route index element={<Dashboard />} />
  <Route path="announcements" element={<Announcements />} />

  {/* EMPLOYEE */}
  <Route element={<RoleRoute allowedRoles={['EMPLOYEE']} />}>
    <Route path="my-leaves" element={<MyLeaves />} />
  </Route>

  {/* ADMIN + HR */}
  <Route element={<RoleRoute allowedRoles={['ADMIN', 'HR']} />}>
    <Route path="employees" element={<Employees />} />
    <Route path="departments" element={<Departments />} />
    <Route path="leave-requests" element={<LeaveRequests />} />
  </Route>

  {/* ADMIN ONLY */}
  <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
    <Route path="users" element={<Users />} />
  </Route>
</Route>

          {/* Catch-all Route redirecting to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
