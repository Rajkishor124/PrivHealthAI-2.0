interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div
    role="status"
    aria-label="Loading"
    className={`${sizeMap[size]} rounded-full border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 animate-spin ${className}`}
  />
);

export default Spinner;
