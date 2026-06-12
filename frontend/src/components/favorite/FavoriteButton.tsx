import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { favoriteService } from '../../services/favoriteService';
import { getApiError } from '../../utils';

interface Props {
  doctorId: string;
  /** When provided, the parent already knows the state and we skip the initial fetch. */
  initialFavorited?: boolean;
  onChange?: (favorited: boolean) => void;
}

const FavoriteButton = ({ doctorId, initialFavorited, onChange }: Props) => {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(!!initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || initialFavorited !== undefined) return;
    let active = true;
    favoriteService
      .getStatus(doctorId)
      .then((res) => { if (active) setFavorited(res.data.favorited); })
      .catch(() => {/* non-fatal */});
    return () => { active = false; };
  }, [doctorId, isAuthenticated, initialFavorited]);

  if (!isAuthenticated) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.toggle(doctorId);
      setFavorited(res.data.favorited);
      onChange?.(res.data.favorited);
      toast.success(res.data.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error(getApiError(err, 'Could not update favorites'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-colors disabled:opacity-50 ${
        favorited
          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-500'
          : 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800'
      }`}
    >
      <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;
