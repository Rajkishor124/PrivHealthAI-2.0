import { Activity } from 'lucide-react';

const SymptomSummaryCard = ({ summary }: { summary: string }) => {
  if (!summary) return null;
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
        <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
          Summary
        </h4>
        <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};

export default SymptomSummaryCard;
