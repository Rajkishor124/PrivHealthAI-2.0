import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Building2, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { favoriteService } from '../../services/favoriteService';
import type { Doctor } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../../components/common/Spinner';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await favoriteService.getMine();
      setDoctors(res.data);
    } catch (err) {
      toast.error(getApiError(err, 'Could not load favorites'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const removeFavorite = async (doctorId: string) => {
    try {
      await favoriteService.toggle(doctorId);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error(getApiError(err, 'Could not remove favorite'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Favorite Doctors</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to save and view your favorite doctors.</p>
        <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Doctors</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Doctors you've bookmarked for quick access</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading favorites…</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-10 text-center">
          <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-7 w-7 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No favorites yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tap the heart on a doctor's profile to save them here.</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Stethoscope className="h-4 w-4" /> Browse Doctors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((d) => (
            <div key={d.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {d.fullName.replace('Dr. ', '').charAt(0)}
                </div>
                <button
                  onClick={() => removeFavorite(d.id)}
                  aria-label="Remove from favorites"
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>
              <Link to={`/doctors/${d.id}`} className="group">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{d.fullName}</h3>
              </Link>
              <span className="inline-block mt-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-2.5 py-0.5 font-medium w-fit">
                {d.specialization}
              </span>
              <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                {d.hospital && <p className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 shrink-0" /> {d.hospital}</p>}
                {d.city && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> {[d.city, d.country].filter(Boolean).join(', ')}</p>}
                {d.rating != null && (
                  <p className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                    <Star className="h-3.5 w-3.5 fill-current" /> {Number(d.rating).toFixed(1)}
                  </p>
                )}
              </div>
              <Link
                to={`/doctors/${d.id}`}
                className="mt-4 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-lg py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
