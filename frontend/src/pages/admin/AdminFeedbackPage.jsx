import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, MessageSquare, Award, Clock, User, Trash2 } from "lucide-react";
import { fetchFeedbacks, deleteFeedback } from "../../redux/slices/feedbackSlice";
import Loader from "../../components/common/Loader";

const AdminFeedbackPage = () => {
  const dispatch = useDispatch();
  const { feedbacks, averageRating, loading } = useSelector((state) => state.feedback);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete feedback from "${name}"?`)) {
      dispatch(deleteFeedback(id));
    }
  };

  if (loading && feedbacks.length === 0) {
    return <Loader text="Loading feedbacks..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Top Header Card */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">User Feedbacks</h1>
            <p className="mt-1 text-sm text-slate-500">Monitor overall user satisfaction and manage reviews.</p>
          </div>

          <div className="flex items-center gap-6 rounded-2xl bg-blue-50 px-6 py-4 border border-blue-100">
            <div className="flex items-center gap-2 text-amber-500">
              <Award size={28} />
              <span className="text-2xl font-extrabold text-slate-900">{averageRating}</span>
              <span className="text-sm text-slate-400">/ 5</span>
            </div>
            <div className="border-l border-blue-200 pl-6">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total Reviews</p>
              <p className="text-lg font-bold text-slate-900">{feedbacks.length}</p>
            </div>
          </div>
        </div>

        {/* Feedbacks Grid */}
        {feedbacks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No feedbacks yet</h3>
            <p className="text-xs text-slate-400 mt-1">Feedback submitted by users will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((item) => (
              <div key={item._id} className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md group">
                
                {/* Delete Button on Hover / Top Right */}
                <button
                  onClick={() => handleDelete(item._id, item.name)}
                  title="Delete Feedback"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-80 hover:bg-red-600 hover:text-white transition shadow-sm"
                >
                  <Trash2 size={15} />
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-3 pr-8">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <User size={15} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 truncate">{item.name || "Anonymous"}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.rating} ★
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700 italic mt-2">
                    "{item.comment}"
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <Clock size={13} />
                  <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFeedbackPage;