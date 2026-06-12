import { Fragment, type ReactNode } from 'react';

/** Render inline **bold** segments safely (no HTML injection). */
const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-gray-900 dark:text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );

/**
 * Lightweight renderer for the bot's "info" replies: supports **bold**, "• "/"- "
 * bullet lines, and blank-line paragraph breaks. Avoids a full markdown dependency.
 */
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="space-y-1 my-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-indigo-400 dark:text-indigo-500 shrink-0">•</span>
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const bulletMatch = line.match(/^([•\-*])\s+(.*)$/);
    if (bulletMatch) {
      bullets.push(bulletMatch[2]);
    } else {
      flushBullets(`ul-${idx}`);
      if (line) {
        blocks.push(
          <p key={`p-${idx}`} className="leading-relaxed">
            {renderInline(line)}
          </p>,
        );
      }
    }
  });
  flushBullets('ul-end');

  return <div className="space-y-1.5 text-sm">{blocks}</div>;
};

export default FormattedText;
