import { useState, useEffect } from 'react';
import { Users, Stethoscope, Activity, MessageCircle, AlertTriangle, AlertOctagon, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { AdminStats } from '../../types';
import { getApiError } from '../../utils';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}

const StatCard = ({ label, value, icon: Icon, color, loading }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {loading ? (
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    ) : (
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value?.toLocaleString() ?? '—'}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        toast.error(getApiError(err, 'Failed to load stats'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" loading={loading} />
        <StatCard label="Total Doctors" value={stats?.totalDoctors} icon={Stethoscope} color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" loading={loading} />
        <StatCard label="Assessments" value={stats?.totalAssessments} icon={Activity} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" loading={loading} />
        <StatCard label="Chat Messages" value={stats?.totalChatMessages} icon={MessageCircle} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" loading={loading} />
        <StatCard label="Appointments" value={stats?.totalAppointments} icon={CalendarDays} color="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" loading={loading} />
        <StatCard label="High Risk" value={stats?.highRiskAssessments} icon={AlertTriangle} color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" loading={loading} />
        <StatCard label="Critical Risk" value={stats?.criticalRiskAssessments} icon={AlertOctagon} color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" loading={loading} />
      </div>
    </div>
  );
};

export default AdminDashboard;
