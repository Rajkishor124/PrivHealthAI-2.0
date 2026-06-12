import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Clock, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentService } from '../../services/appointmentService';
import { getApiError } from '../../utils';
import Spinner from '../common/Spinner';

interface Props {
  open: boolean;
  doctorId: string;
  doctorName: string;
  specialization?: string;
  onClose: () => void;
}

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const formatSlot = (slot: string) => {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};

const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const BookAppointmentModal = ({ open, doctorId, doctorName, specialization, onClose }: Props) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(tomorrowISO());
  const [slot, setSlot] = useState('10:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleBook = async () => {
    if (!date || !slot) {
      toast.error('Please pick a date and time');
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.book({
        doctorId,
        appointmentTime: `${date}T${slot}:00`,
        reason: reason.trim() || undefined,
      });
      toast.success('Appointment booked!');
      onClose();
      navigate('/appointments');
    } catch (err) {
      toast.error(getApiError(err, 'Could not book appointment'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={submitting ? undefined : onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl animate-[fadeInUp_0.25s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Book Appointment</h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Doctor */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doctorName}</p>
              {specialization && <p className="text-xs text-indigo-600 dark:text-indigo-400">{specialization}</p>}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              <Calendar className="h-3.5 w-3.5" /> Date
            </label>
            <input
              type="date"
              value={date}
              min={tomorrowISO()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Time slots */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              <Clock className="h-3.5 w-3.5" /> Time Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                    slot === s
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {formatSlot(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Reason <span className="text-gray-400 dark:text-gray-500">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="e.g. routine check-up, follow-up on chest pain…"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <><Spinner size="sm" className="border-white/40 border-t-white" /> Booking…</> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
