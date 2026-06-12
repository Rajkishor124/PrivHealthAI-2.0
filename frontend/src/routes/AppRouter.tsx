import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DoctorSearch from '../pages/doctors/DoctorSearch';
import DoctorDetails from '../pages/doctors/DoctorDetails';
import Assessment from '../pages/assessment/Assessment';
import Chatbot from '../pages/chatbot/Chatbot';
import MyAppointments from '../pages/appointments/MyAppointments';
import Favorites from '../pages/favorites/Favorites';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAppointments from '../pages/admin/AdminAppointments';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '/doctors', element: <DoctorSearch /> },
      { path: '/doctors/:id', element: <DoctorDetails /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/assessment', element: <Assessment /> },
          { path: '/chatbot', element: <Chatbot /> },
          { path: '/appointments', element: <MyAppointments /> },
          { path: '/favorites', element: <Favorites /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'doctors', element: <AdminDoctors /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'appointments', element: <AdminAppointments /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
