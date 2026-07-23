import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';
import Unauthorized from './pages/Unauthorized';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import UserDetail from './pages/admin/UserDetail';
import CreateUser from './pages/admin/CreateUser';
import AdminStores from './pages/admin/Stores';
import CreateStore from './pages/admin/CreateStore';

import StoreList from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

function RootRedirect() {
  const { user, loading, homePath } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  return <Navigate to={user ? homePath : '/login'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/new" element={<CreateUser />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/admin/stores/new" element={<CreateStore />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
        <Route path="/stores" element={<StoreList />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
