import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { AdminAppointment, AppointmentStatus, PageResponse } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../../components/common/Spinner';

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  BOOKED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  CANCELLED: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

const AdminAppointments = () => {
  const [data, setData] = useState<PageResponse<AdminAppointment> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await adminService.getAppointments(p, 15);
      setData(res.data);
    } catch (err) {
      toast.error(getApiError(err, 'Failed to load appointments'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appointments</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !data || data.content.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-16">No appointments booked yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3 hidden md:table-cell">Specialization</th>
                    <th className="px-5 py-3">When</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{a.patientName}</td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{a.doctorName}</td>
                      <td className="px-5 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400">{a.specialization ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatWhen(a.appointmentTime)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs rounded-full px-2.5 py-1 font-semibold ${STATUS_STYLE[a.status]}`}>
                          {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Page {data.pageNumber + 1} of {data.totalPages} ({data.totalElements} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={data.pageNumber === 0}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
