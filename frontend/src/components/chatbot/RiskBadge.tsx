import type { ChatRiskLevel } from '../../types';

const CONFIG: Record<ChatRiskLevel, { label: string; dot: string; className: string }> = {
  LOW: {
    label: 'Low Risk',
    dot: '🟢',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  MEDIUM: {
    label: 'Medium Risk',
    dot: '🟡',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  HIGH: {
    label: 'High Risk',
    dot: '🔴',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
};

const RiskBadge = ({ level }: { level: ChatRiskLevel }) => {
  const cfg = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.className}`}>
      <span aria-hidden>{cfg.dot}</span> {cfg.label}
    </span>
  );
};

export default RiskBadge;
