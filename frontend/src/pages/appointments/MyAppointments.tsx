import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, MapPin, Building2, Stethoscope, X, CalendarPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService } from '../../services/appointmentService';
import type { Appointment, AppointmentStatus } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../../components/common/Spinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  BOOKED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  CANCELLED: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return { date, time };
};

const MyAppointments = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await appointmentService.getMine();
      setAppointments(res.data);
    } catch (err) {
      toast.error(getApiError(err, 'Could not load appointments'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await appointmentService.cancel(cancelTarget.id);
      toast.success('Appointment cancelled');
      setCancelTarget(null);
      await load();
    } catch (err) {
      toast.error(getApiError(err, 'Could not cancel appointment'));
    } finally {
      setCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Appointments</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to view and manage your appointments.</p>
        <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage your booked appointments</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading appointments…</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-10 text-center">
          <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-7 w-7 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No appointments yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Find a doctor and book your first appointment.</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <CalendarPlus className="h-4 w-4" /> Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => {
            const { date, time } = formatWhen(a.appointmentTime);
            const isPast = new Date(a.appointmentTime).getTime() < Date.now();
            const canCancel = a.status === 'BOOKED' && !isPast;
            return (
              <div
                key={a.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {a.doctorName.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{a.doctorName}</h3>
                        {a.specialization && (
                          <p className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                            <Stethoscope className="h-3 w-3" /> {a.specialization}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs rounded-full px-2.5 py-1 font-semibold shrink-0 ${STATUS_STYLE[a.status]}`}>
                        {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {time}</span>
                      {a.hospital && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {a.hospital}</span>}
                      {a.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {a.city}</span>}
                    </div>

                    {a.reason && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">“{a.reason}”</p>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => setCancelTarget(a)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel this appointment?"
        message={
          cancelTarget
            ? `Your appointment with ${cancelTarget.doctorName} will be cancelled. This cannot be undone.`
            : ''
        }
        confirmLabel={cancelling ? 'Cancelling…' : 'Cancel Appointment'}
        cancelLabel="Keep"
        variant="danger"
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default MyAppointments;
