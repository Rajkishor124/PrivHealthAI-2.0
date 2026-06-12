import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Award, Phone, BookOpen, Hash, Building2, CalendarPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../services/doctorService';
import type { Doctor } from '../../types';
import { getApiError } from '../../utils';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import BookAppointmentModal from '../../components/appointment/BookAppointmentModal';
import DoctorReviewsSection from '../../components/review/DoctorReviewsSection';
import FavoriteButton from '../../components/favorite/FavoriteButton';

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="flex items-center gap-1">
      {stars.map((filled, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await doctorService.getById(id);
        setDoctor(res.data);
      } catch (err) {
        setError(getApiError(err, 'Doctor not found'));
        toast.error('Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading doctor profile…</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link to="/doctors" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Doctors
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium">{error ?? 'Doctor not found'}</p>
          <Link to="/doctors" className="mt-4 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Browse all doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/doctors" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Doctors
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 px-6 py-8">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-3xl shrink-0">
              {doctor.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{doctor.fullName}</h1>
              <span className="inline-block mt-1 text-sm bg-indigo-600 text-white rounded-full px-3 py-0.5 font-medium">
                {doctor.specialization}
              </span>
              {doctor.hospital && (
                <p className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  {doctor.hospital}
                </p>
              )}
              {doctor.rating != null && (
                <div className="mt-2">
                  <StarRating rating={Number(doctor.rating)} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Doctor Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.qualification && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Qualification</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-0.5">{doctor.qualification}</p>
                </div>
              </div>
            )}
            {doctor.experienceYears != null && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-0.5">{doctor.experienceYears} years of practice</p>
                </div>
              </div>
            )}
            {(doctor.city || doctor.country) && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-0.5">
                    {[doctor.city, doctor.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Hash className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">License Number</p>
                <p className="text-sm font-mono font-medium text-gray-800 dark:text-gray-100 mt-0.5">{doctor.licenseNumber}</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4" /> Contact This Doctor
            </h3>
            {doctor.contactInfo ? (
              <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">{doctor.contactInfo}</p>
            ) : (
              <p className="text-sm text-indigo-500 dark:text-indigo-400">Contact information not available. Please visit the hospital directly.</p>
            )}
          </div>

          {/* Book Appointment CTA */}
          <div className="mt-6">
            {isAuthenticated ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <CalendarPlus className="h-5 w-5" /> Book Appointment
                </button>
                <FavoriteButton doctorId={doctor.id} />
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <CalendarPlus className="h-5 w-5" /> Sign in to Book Appointment
              </Link>
            )}
          </div>
        </div>
      </div>

      <DoctorReviewsSection doctorId={doctor.id} />

      <BookAppointmentModal
        open={bookingOpen}
        doctorId={doctor.id}
        doctorName={doctor.fullName}
        specialization={doctor.specialization}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
};

export default DoctorDetails;
