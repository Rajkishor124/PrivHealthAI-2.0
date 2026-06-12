import { AlertTriangle } from 'lucide-react';

const EmergencyWarningCard = ({ items }: { items: string[] }) => {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-400 shrink-0" />
        <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
          🚨 Seek immediate medical attention if:
        </h4>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-red-800 dark:text-red-200">
            <span className="text-red-500 dark:text-red-400 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyWarningCard;
