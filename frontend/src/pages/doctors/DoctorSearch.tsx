import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award, Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../services/doctorService';
import type { Doctor } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../../components/common/Spinner';

const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Orthopedics',
  'General Medicine',
];

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md dark:hover:shadow-gray-950/50 hover:-translate-y-0.5 transition-all">
    <div className="flex items-start gap-3">
      <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg shrink-0">
        {doctor.fullName.charAt(0)}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{doctor.fullName}</h3>
        <span className="inline-block mt-1 text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full px-2 py-0.5 font-medium">
          {doctor.specialization}
        </span>
      </div>
    </div>

    {doctor.hospital && (
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doctor.hospital}</p>
    )}

    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
      {(doctor.city || doctor.country) && (
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {[doctor.city, doctor.country].filter(Boolean).join(', ')}
        </span>
      )}
      {doctor.rating != null && (
        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {Number(doctor.rating).toFixed(1)}
        </span>
      )}
      {doctor.experienceYears != null && (
        <span className="flex items-center gap-1">
          <Award className="h-3 w-3 shrink-0" />
          {doctor.experienceYears}y
        </span>
      )}
    </div>

    <Link
      to={`/doctors/${doctor.id}`}
      className="mt-auto block text-center text-sm bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition-colors"
    >
      View Profile
    </Link>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    <div className="flex gap-3">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg mt-auto" />
  </div>
);

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const DoctorSearch = () => {
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [pendingSpec, setPendingSpec] = useState('');
  const [pendingCity, setPendingCity] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searching, setSearching] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const busy = searching || clearing || loading;

  const fetchDoctors = useCallback(async (spec: string, cty: string, pg: number) => {
    setLoading(true);
    try {
      const res = await doctorService.search({
        specialization: spec || undefined,
        city: cty || undefined,
        page: pg,
        size: 12,
      });
      setDoctors(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      toast.error(getApiError(err, 'Failed to load doctors'));
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors(specialization, city, page);
  }, [page, fetchDoctors, specialization, city]);

  const handleSearch = async () => {
    if (busy) return;
    setSearching(true);
    await delay(650);
    setSearching(false);
    setSpecialization(pendingSpec);
    setCity(pendingCity);
    setPage(0);
    setFiltersOpen(false);
  };

  const handleClear = async () => {
    if (busy) return;
    setClearing(true);
    await delay(400);
    setClearing(false);
    setPendingSpec('');
    setPendingCity('');
    setSpecialization('');
    setCity('');
    setPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  /* ── Filter panel (shared between sidebar and mobile drawer) ── */
  const renderFilterPanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Filters</h2>
        {busy && <Spinner size="xs" />}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Specialization</label>
        <select
          value={pendingSpec}
          onChange={(e) => setPendingSpec(e.target.value)}
          disabled={busy}
          className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City</label>
        <input
          type="text"
          value={pendingCity}
          onChange={(e) => setPendingCity(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={busy}
          placeholder="e.g. Mumbai"
          className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm rounded-lg py-2 font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {searching ? (
          <>
            <Spinner size="xs" className="border-white/40 border-t-white" />
            Searching…
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Search
          </>
        )}
      </button>

      {/* Clear button — only shown when a filter is active */}
      {(specialization || city || pendingSpec || pendingCity) && (
        <button
          onClick={handleClear}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing ? (
            <>
              <Spinner size="xs" />
              Clearing…
            </>
          ) : (
            <>
              <X className="h-3 w-3" />
              Clear filters
            </>
          )}
        </button>
      )}

      {/* Active filter chips */}
      {(specialization || city) && !searching && !clearing && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
          {specialization && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-2.5 py-1 font-medium">
              {specialization}
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-2.5 py-1 font-medium">
              {city}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find a Doctor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse and filter verified doctors across India</p>
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          disabled={busy}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50"
        >
          {busy ? <Spinner size="xs" /> : <SlidersHorizontal className="h-4 w-4" />}
          Filters
          {(specialization || city) && !busy && (
            <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
          )}
        </button>
      </div>

      {/* Mobile collapsible filters */}
      {filtersOpen && (
        <div className="md:hidden mb-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 animate-[slideDown_0.15s_ease-out]">
          {renderFilterPanel()}
        </div>
      )}

      <div className="flex gap-6 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sticky top-24">
          {renderFilterPanel()}
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0 relative">
          {/* Spinner overlay while re-fetching (not initial load) */}
          {(loading || searching) && !initialLoad && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/70 dark:bg-gray-950/70 backdrop-blur-sm rounded-2xl min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searching ? 'Applying filters…' : 'Loading results…'}
                </p>
              </div>
            </div>
          )}

          {(specialization || city) && !loading && !searching && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {totalElements} result{totalElements !== 1 ? 's' : ''}
              {specialization && <> for <span className="font-medium text-gray-700 dark:text-gray-200">{specialization}</span></>}
              {city && <> in <span className="font-medium text-gray-700 dark:text-gray-200">{city}</span></>}
            </p>
          )}

          {initialLoad && loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : doctors.length === 0 && !loading && !searching ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No doctors found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0 || busy}
                    className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {page + 1} of {totalPages} ({totalElements} doctors)
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages - 1 || busy}
                    className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;
