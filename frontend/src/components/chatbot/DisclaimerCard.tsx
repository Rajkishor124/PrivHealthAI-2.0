import { Info } from 'lucide-react';

const DisclaimerCard = () => (
  <div className="flex items-start gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
    <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
      PrivHealthAI provides informational guidance only and is not a substitute for professional
      medical advice.
    </p>
  </div>
);

export default DisclaimerCard;
