import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight } from 'lucide-react';

/** Specialist names in our doctor dataset — others link to the general search. */
const KNOWN_SPECIALIZATIONS = ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'General Medicine'];

const DoctorRecommendationCard = ({ specialist }: { specialist: string }) => {
  const match = KNOWN_SPECIALIZATIONS.find(
    (s) => specialist.toLowerCase().includes(s.toLowerCase().split(' ')[0]),
  );
  const to = match ? `/doctors?specialization=${encodeURIComponent(match)}` : '/doctors';

  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group"
    >
      <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
        <Stethoscope className="h-4.5 w-4.5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
          Recommended Specialist
        </p>
        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 truncate">
          👨‍⚕️ {specialist}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-indigo-400 dark:text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
};

export default DoctorRecommendationCard;
