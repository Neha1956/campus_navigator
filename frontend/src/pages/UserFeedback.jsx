import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Send, Loader2, CheckCircle2, MessageSquare, Award, User, Sparkles, Quote, ThumbsUp } from "lucide-react";
import { submitFeedback, fetchFeedbacks, clearFeedbackStatus } from "../redux/slices/feedbackSlice";
import Loader from "../components/common/Loader";

const UserFeedback = () => {
  const dispatch = useDispatch();
  const { feedbacks, averageRating, loading, successMessage, error } = useSelector((state) => state.feedback);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    dispatch(submitFeedback({ name: name || "Anonymous", rating, comment })).then((res) => {
      setSubmitting(false);
      if (!res.error) {
        setName("");
        setComment("");
        setRating(5);
        dispatch(fetchFeedbacks());
        setTimeout(() => {
          dispatch(clearFeedbackStatus());
        }, 4000);
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Top Banner */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-bold text-blue-700 mb-3 border border-blue-200/60 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-blue-600 animate-pulse" />
            <span>We Value Your Opinion</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Campus Feedback & Community Reviews
          </h1>
          <p className="mt-2 text-xs text-slate-600 max-w-xl mx-auto sm:text-sm leading-relaxed">
            Help us enhance your Campus Navigator experience by sharing your valuable feedback, suggestions, or ratings.
          </p>
        </div>

        {/* Main Grid: Form & Statistics */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 mb-12 items-start">
          
          {/* Left Column: Stats & Rating Summary */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xl shadow-slate-100 flex flex-col justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5">Community Score</h2>
                <p className="text-[11px] sm:text-xs text-slate-400">Based on verified user evaluations</p>
              </div>

              <div className="my-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="text-left">
                  <span className="text-3xl sm:text-4xl font-extrabold">{averageRating}</span>
                  <span className="block text-[10px] font-semibold text-blue-200 tracking-wider mt-0.5">OUT OF 5.0</span>
                </div>
                <div className="border-l border-blue-400/40 pl-4 text-right">
                  <div className="flex gap-1 mb-1 justify-end text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className={i < Math.round(averageRating) ? "fill-amber-300" : "text-blue-400/40"} />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-white">{feedbacks.length} Total Reviews</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>100% Secure & Verified Community Feedback</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Award size={13} />
                  </div>
                  <span>Directly reviewed by campus admin team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Submit Form */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xl shadow-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ThumbsUp size={18} className="text-blue-600" />
              <span>Leave Your Review</span>
            </h2>

            {successMessage && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-800 animate-fadeIn">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <p className="text-xs font-semibold">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Select Your Rating</p>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="transition-transform active:scale-90 focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={28}
                        className={`${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400 drop-shadow"
                            : "text-slate-200"
                        } transition-colors sm:w-8 sm:h-8`}
                      />
                    </button>
                  ))}
                </div>
                <span className="mt-2 text-xs font-bold text-amber-600">
                  {rating === 5 ? "🌟 Excellent Experience!" : rating === 4 ? "😊 Very Good" : rating === 3 ? "😐 Average" : rating === 2 ? "😕 Needs Improvement" : "😞 Poor"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback / Suggestions</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience navigating the campus..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                ></textarea>
              </div>

              {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-50 active:scale-[0.99]"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                <span>{submitting ? "Submitting..." : "Post Review"}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Public Feedbacks Wall */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              <span>Recent Community Reviews</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {feedbacks.length} Reviews
            </span>
          </div>

          {loading && feedbacks.length === 0 ? (
            <Loader text="Loading reviews..." />
          ) : feedbacks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <MessageSquare size={36} className="mx-auto mb-2 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">No reviews yet</h4>
              <p className="text-xs text-slate-400 mt-0.5">Be the first one to share your feedback!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((item) => (
                <div key={item._id} className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-200 group">
                  <Quote size={24} className="absolute right-4 top-4 text-slate-100 group-hover:text-blue-50 transition-colors pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs shadow-inner">
                        {item.name ? item.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.name || "Anonymous"}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 italic">
                      "{item.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserFeedback;