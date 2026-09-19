import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import formatTimestamp from "../utils/date-formatter";
import { useNavigate } from "react-router-dom";
import {
    FiEdit2,
    FiTrash2,
    FiMessageSquare,
    FiX,
    FiCheckCircle,
    FiCornerUpLeft,
} from "react-icons/fi";

export default function ReviewSection({ productId, onRatingChange }) {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [breakdown, setBreakdown] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    });

    const [myReview, setMyReview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formRating, setFormRating] = useState(5);
    const [formTitle, setFormTitle] = useState("");
    const [formComment, setFormComment] = useState("");
    const [saving, setSaving] = useState(false);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
    const loggedIn = !!token;

    /* ================= LOAD REVIEWS ================= */
    useEffect(() => {
        setLoading(true);
        api.get(`/reviews/product/${productId}/${pageNumber}/${pageSize}`)
            .then((res) => {
                setReviews(res.data.reviews);
                setTotalPages(res.data.totalPages);
                setTotalReviews(res.data.totalReviews);
                setAvgRating(res.data.avgRating || 0);
                setBreakdown(res.data.breakdown || {});
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [productId, pageNumber, pageSize]);

    /* ================= LOAD MY REVIEW ================= */
    useEffect(() => {
        if (!loggedIn) {
            setMyReview(null);
            return;
        }
        api.get(`/reviews/mine/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setMyReview(res.data.review);
                if (res.data.review) {
                    setFormRating(res.data.review.rating);
                    setFormTitle(res.data.review.title || "");
                    setFormComment(res.data.review.comment || "");
                }
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, loggedIn, token]);

    /* ================= SUBMIT ================= */
    async function handleSubmit() {
        if (!loggedIn) {
            toast.error("Please login to write a review");
            navigate("/signin", {
                state: { redirectTo: `/overview/${productId}` },
            });
            return;
        }

        if (!formComment.trim()) {
            toast.error("Please write a comment");
            return;
        }
        if (formComment.trim().length < 3) {
            toast.error("Comment must be at least 3 characters");
            return;
        }

        try {
            setSaving(true);
            const res = await api.post(
                `/reviews/product/${productId}`,
                {
                    rating: formRating,
                    title: formTitle,
                    comment: formComment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            setMyReview(res.data.review);
            setShowForm(false);
            setPageNumber(1);

            // notify parent so product header can update
            if (onRatingChange) {
                onRatingChange(
                    res.data.avgRating,
                    res.data.reviewCount
                );
            }

            // trigger refresh
            const reload = await api.get(
                `/reviews/product/${productId}/1/${pageSize}`
            );
            setReviews(reload.data.reviews);
            setTotalPages(reload.data.totalPages);
            setTotalReviews(reload.data.totalReviews);
            setAvgRating(reload.data.avgRating || 0);
            setBreakdown(reload.data.breakdown || {});
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to submit review"
            );
        } finally {
            setSaving(false);
        }
    }

    /* ================= DELETE MINE ================= */
    async function handleDeleteMine() {
        if (!window.confirm("Delete your review?")) return;

        try {
            await api.delete(`/reviews/mine/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Review deleted");
            setMyReview(null);
            setFormRating(5);
            setFormTitle("");
            setFormComment("");
            setPageNumber(1);

            const reload = await api.get(
                `/reviews/product/${productId}/1/${pageSize}`
            );
            setReviews(reload.data.reviews);
            setTotalPages(reload.data.totalPages);
            setTotalReviews(reload.data.totalReviews);
            setAvgRating(reload.data.avgRating || 0);
            setBreakdown(reload.data.breakdown || {});
            if (onRatingChange) {
                onRatingChange(
                    reload.data.avgRating,
                    reload.data.reviewCount
                );
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to delete review"
            );
        }
    }

    /* ================= START EDIT ================= */
    function startEdit() {
        if (myReview) {
            setFormRating(myReview.rating);
            setFormTitle(myReview.title || "");
            setFormComment(myReview.comment || "");
        }
        setShowForm(true);
    }

    return (
        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* ================= HEADER / SUMMARY ================= */}
            <div className="p-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                            Customer Reviews
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalReviews === 0
                                ? "Be the first to review this product"
                                : `${totalReviews} ${
                                      totalReviews === 1
                                          ? "review"
                                          : "reviews"
                                  }`}
                        </p>
                    </div>

                    {/* Write / Edit / Delete button */}
                    {loggedIn ? (
                        myReview ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={startEdit}
                                    className="inline-flex items-center gap-2 px-4 h-[42px] rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <FiEdit2 size={14} />
                                    Edit My Review
                                </button>
                                <button
                                    onClick={handleDeleteMine}
                                    className="inline-flex items-center gap-2 px-4 h-[42px] rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    <FiTrash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 px-5 h-[42px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                            >
                                <FiMessageSquare size={14} />
                                Write a Review
                            </button>
                        )
                    ) : (
                        <button
                            onClick={() =>
                                navigate("/signin", {
                                    state: {
                                        redirectTo: `/overview/${productId}`,
                                    },
                                })
                            }
                            className="inline-flex items-center gap-2 px-5 h-[42px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                        >
                            <FiMessageSquare size={14} />
                            Login to Review
                        </button>
                    )}
                </div>

                {/* Rating summary grid */}
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
                    {/* Big avg */}
                    <div className="flex flex-col items-center justify-center py-4 px-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10">
                        <div className="text-4xl lg:text-5xl font-bold text-accent">
                            {Number(avgRating).toFixed(1)}
                        </div>
                        <div className="mt-2">
                            <StarRating value={avgRating} size={18} readOnly />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            Based on {totalReviews}{" "}
                            {totalReviews === 1 ? "review" : "reviews"}
                        </div>
                    </div>

                    {/* Breakdown bars */}
                    <div className="flex flex-col gap-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const cnt = breakdown[star] || 0;
                            const pct =
                                totalReviews > 0
                                    ? (cnt / totalReviews) * 100
                                    : 0;
                            return (
                                <div
                                    key={star}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-xs text-gray-500 w-8 flex-shrink-0">
                                        {star} ★
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 transition-all"
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
                                        {cnt}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ================= WRITE/EDIT FORM ================= */}
            {showForm && (
                <div className="p-6 lg:p-8 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                            {myReview ? "Edit your review" : "Write a review"}
                        </h3>
                        <button
                            onClick={() => setShowForm(false)}
                            className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-500"
                        >
                            <FiX size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 max-w-2xl">
                        {/* Rating picker */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                Your Rating
                            </label>
                            <StarRating
                                value={formRating}
                                onChange={setFormRating}
                                size={28}
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Title{" "}
                                <span className="text-gray-400 font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) =>
                                    setFormTitle(e.target.value)
                                }
                                placeholder="Summarize your experience"
                                maxLength={80}
                                className="w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Your Review
                            </label>
                            <textarea
                                value={formComment}
                                onChange={(e) =>
                                    setFormComment(e.target.value)
                                }
                                rows={4}
                                maxLength={2000}
                                placeholder="What did you like or dislike? How was the quality?"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none transition-all"
                            ></textarea>
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {formComment.length}/2000
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                                className="px-5 h-[44px] rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-6 h-[44px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 inline-flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle size={15} />
                                        {myReview
                                            ? "Update Review"
                                            : "Submit Review"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= LIST ================= */}
            <div className="p-6 lg:p-8">
                {loading && (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse p-4 rounded-2xl border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && reviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FiMessageSquare
                                size={24}
                                className="text-gray-400"
                            />
                        </div>
                        <h3 className="font-semibold text-gray-700 mb-1">
                            No reviews yet
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Be the first to share your experience with this
                            product.
                        </p>
                    </div>
                )}

                {!loading && reviews.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review) => (
                            <ReviewItem
                                key={review._id}
                                review={review}
                                isMine={
                                    myReview &&
                                    myReview._id === review._id
                                }
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            disabled={pageNumber === 1}
                            onClick={() => setPageNumber(pageNumber - 1)}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pageNumber} of {totalPages}
                        </span>
                        <button
                            disabled={pageNumber === totalPages}
                            onClick={() => setPageNumber(pageNumber + 1)}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ================= SINGLE REVIEW ITEM ================= */
function ReviewItem({ review, isMine }) {
    return (
        <div
            className={`p-5 rounded-2xl border ${
                isMine
                    ? "bg-accent/5 border-accent/20"
                    : "bg-white border-gray-100"
            }`}
        >
            <div className="flex items-start gap-4">
                <img
                    src={review.userImage || "/default-profile.png"}
                    alt={review.userName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                    onError={(e) => {
                        e.target.src = "/default-profile.png";
                    }}
                />

                <div className="flex-1 min-w-0">
                    {/* Name + date + badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">
                            {review.userName}
                        </span>
                        {isMine && (
                            <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wide">
                                You
                            </span>
                        )}
                        <span className="text-xs text-gray-400">
                            {formatTimestamp(review.date)}
                        </span>
                    </div>

                    {/* Stars + title */}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <StarRating value={review.rating} size={14} />
                        {review.title && (
                            <span className="font-semibold text-gray-800 text-sm">
                                {review.title}
                            </span>
                        )}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-700 leading-relaxed mt-3 whitespace-pre-wrap">
                        {review.comment}
                    </p>

                    {/* Admin reply */}
                    {review.adminReply?.body && (
                        <div className="mt-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                    <FiCornerUpLeft size={12} />
                                </div>
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                                    iComputers Team
                                </span>
                                {review.adminReply.repliedAt && (
                                    <span className="text-[11px] text-gray-400">
                                        {formatTimestamp(
                                            review.adminReply.repliedAt
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
                                {review.adminReply.body}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}