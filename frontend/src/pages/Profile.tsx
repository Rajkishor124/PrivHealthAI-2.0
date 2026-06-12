import { Phone, Shield, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatIndianPhone } from '../utils';

const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
  ADMIN: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Administrator' },
  DOCTOR: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Doctor' },
  USER: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Patient' },
};

const Profile = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const role = user?.role ?? 'USER';
  const badge = roleBadge[role] ?? roleBadge.USER;

  const fields = [
    { icon: Phone, label: 'Phone number', value: user?.phone ? formatIndianPhone(user.phone) : '—', mono: true },
    { icon: Shield, label: 'Account role', value: badge.label, mono: false },
    { icon: User, label: 'User ID', value: user?.id ?? '—', mono: true },
    { icon: Calendar, label: 'Account type', value: 'Standard', mono: false },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      {/* Avatar card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name ?? 'Guest'}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
            <span className="text-indigo-200 text-xs">{user?.phone ? formatIndianPhone(user.phone) : ''}</span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
        {fields.map(({ icon: Icon, label, value, mono }) => (
          <div key={label} className="flex items-center gap-4 px-6 py-4">
            <div className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
              <p className={`mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-100 truncate ${mono ? 'font-mono' : ''}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
        Profile editing and additional settings coming in Phase 3.
      </p>
    </div>
  );
};

export default Profile;
