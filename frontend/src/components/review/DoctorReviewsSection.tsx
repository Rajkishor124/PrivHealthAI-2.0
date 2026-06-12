import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { reviewService } from '../../services/reviewService';
import type { DoctorReviews } from '../../types';
import { getApiError } from '../../utils';
import Spinner from '../common/Spinner';
import ConfirmDialog from '../common/ConfirmDialog';
import StarRatingInput from './StarRatingInput';

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-3.5 w-3.5 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))}
  </div>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const DoctorReviewsSection = ({ doctorId }: { doctorId: string }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<DoctorReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await reviewService.getForDoctor(doctorId);
      setData(res.data);
      if (res.data.myReview) {
        setRating(res.data.myReview.rating);
        setComment(res.data.myReview.comment ?? '');
      }
    } catch (err) {
      toast.error(getApiError(err, 'Could not load reviews'));
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submit(doctorId, { rating, comment: comment.trim() || undefined });
      toast.success(data?.myReview ? 'Review updated' : 'Thanks for your review!');
      await load();
    } catch (err) {
      toast.error(getApiError(err, 'Could not submit review'));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!data?.myReview) return;
    try {
      await reviewService.remove(data.myReview.id);
      toast.success('Review removed');
      setConfirmDelete(false);
      setRating(0);
      setComment('');
      await load();
    } catch (err) {
      toast.error(getApiError(err, 'Could not remove review'));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mt-6">
      {/* Header / summary */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Patient Reviews
        </h2>
        {data && data.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{data.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">({data.reviewCount})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <>
          {/* Review form / gate */}
          {!isAuthenticated ? (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link> to leave a review.
            </div>
          ) : data?.canReview ? (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {data.myReview ? 'Update your review' : 'Write a review'}
              </p>
              <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Share your experience with this doctor (optional)…"
                className="w-full mt-3 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? <><Spinner size="sm" className="border-white/40 border-t-white" /> Saving…</> : data.myReview ? 'Update Review' : 'Submit Review'}
                </button>
                {data.myReview && (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    disabled={submitting}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              You can review this doctor after booking an appointment with them.
            </div>
          )}

          {/* Review list */}
          {data && data.reviews.length > 0 ? (
            <div className="space-y-4">
              {data.reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                          {r.userName}{r.mine && <span className="ml-1.5 text-xs font-normal text-indigo-500 dark:text-indigo-400">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 ml-10">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              No reviews yet. Be the first to share your experience.
            </p>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete your review?"
        message="Your review and rating for this doctor will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default DoctorReviewsSection;
