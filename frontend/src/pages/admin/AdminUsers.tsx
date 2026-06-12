import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { getApiError, formatDate, formatIndianPhone } from '../../utils';

const roleBadge: Record<string, string> = {
  USER: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  DOCTOR: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  ADMIN: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await adminService.getUsers(page, 15);
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        toast.error(getApiError(err, 'Failed to load users'));
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Users</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 dark:text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-100">{u.name}</td>
                    <td className="px-5 py-4 font-mono text-gray-600 dark:text-gray-400">{formatIndianPhone(u.phone)}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">{u.email ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${roleBadge[u.role] ?? roleBadge.USER}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {u.createdAt ? formatDate(u.createdAt) : '—'}
                    </td>
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

export default AdminUsers;
