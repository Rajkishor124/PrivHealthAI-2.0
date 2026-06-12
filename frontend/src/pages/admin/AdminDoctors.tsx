import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { Doctor } from '../../types';
import { getApiError } from '../../utils';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await adminService.getDoctors(page, 10);
        setDoctors(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        toast.error(getApiError(err, 'Failed to load doctors'));
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctors</h1>
        <button
          disabled
          title="Coming in Phase 3"
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed"
        >
          + Add Doctor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Specialization</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Hospital</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">City</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Exp</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">License</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-500">No doctors found</td>
                </tr>
              ) : (
                doctors.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-xs shrink-0">
                          {d.fullName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">{d.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{d.specialization}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate hidden md:table-cell">{d.hospital ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{d.city ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{d.experienceYears != null ? `${d.experienceYears}y` : '—'}</td>
                    <td className="px-5 py-4 text-yellow-600 dark:text-yellow-400 font-medium">
                      {d.rating != null ? `${Number(d.rating).toFixed(1)} ★` : '—'}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-500 hidden lg:table-cell">{d.licenseNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;
