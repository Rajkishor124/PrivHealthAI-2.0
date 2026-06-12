import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, LogOut, Heart, CalendarDays } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/common/ConfirmDialog';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    setConfirmLogout(false);
    signOut();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 text-white flex flex-col shrink-0">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-800">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">PrivHealthAI</p>
              <p className="text-xs text-indigo-400 mt-0.5">Admin Panel</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/doctors" className={linkClass}>
              <Stethoscope className="h-4 w-4" />
              Doctors
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              <Users className="h-4 w-4" />
              Users
            </NavLink>
            <NavLink to="/admin/appointments" className={linkClass}>
              <CalendarDays className="h-4 w-4" />
              Appointments
            </NavLink>
          </nav>

          {/* User + logout */}
          <div className="border-t border-gray-800 px-3 py-4">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmLogout(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8 bg-gray-100 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Sign out?"
        message="You will be signed out of the admin panel and redirected to the login page."
        confirmLabel="Sign Out"
        cancelLabel="Stay"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
};

export default AdminLayout;
