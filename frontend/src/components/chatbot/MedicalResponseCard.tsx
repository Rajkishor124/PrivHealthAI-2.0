import type { ReactNode } from 'react';
import type { ChatStructured } from '../../types';
import SymptomSummaryCard from './SymptomSummaryCard';
import RiskBadge from './RiskBadge';
import DoctorRecommendationCard from './DoctorRecommendationCard';
import EmergencyWarningCard from './EmergencyWarningCard';
import DisclaimerCard from './DisclaimerCard';

const ListSection = ({
  title,
  items,
  marker,
}: {
  title: string;
  items: string[];
  marker: ReactNode | ((item: string) => ReactNode);
}) => {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="shrink-0">{typeof marker === 'function' ? marker(item) : marker}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MedicalResponseCard = ({ data }: { data: ChatStructured }) => (
  <div className="w-full max-w-[92%] sm:max-w-[85%] bg-white dark:bg-gray-900 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-4 animate-[fadeInUp_0.3s_ease-out]">
    <SymptomSummaryCard summary={data.summary} />

    <ListSection title="Possible Causes" items={data.possibleCauses} marker={<span className="text-indigo-400 dark:text-indigo-500">•</span>} />

    <ListSection title="What You Can Do" items={data.actions} marker={<span aria-hidden>✅</span>} />

    <ListSection title="Avoid" items={data.avoid} marker={<span aria-hidden>⚠️</span>} />

    {(data.riskLevel || data.recommendedSpecialist) && (
      <div className="flex flex-wrap items-center gap-3">
        {data.riskLevel && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
              Risk Level
            </h4>
            <RiskBadge level={data.riskLevel} />
          </div>
        )}
      </div>
    )}

    {data.recommendedSpecialist && <DoctorRecommendationCard specialist={data.recommendedSpecialist} />}

    <EmergencyWarningCard items={data.emergencyWarning} />

    <DisclaimerCard />
  </div>
);

export default MedicalResponseCard;
