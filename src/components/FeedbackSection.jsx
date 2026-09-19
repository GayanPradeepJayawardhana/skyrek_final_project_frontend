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
    FiSend,
} from "react-icons/fi";

const CATEGORIES = [
    "General",
    "Website",
    "Checkout",
    "Delivery",
    "Support",
    "Other",
];

export default function FeedbackSection() {
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFeedback, setTotalFeedback] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [breakdown, setBreakdown] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    });

    const [myFeedback, setMyFeedback] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formRating, setFormRating] = useState(5);
    const [formCategory, setFormCategory] = useState("General");
    const [formTitle, setFormTitle] = useState("");
    const [formComment, setFormComment] = useState("");
    const [saving, setSaving] = useState(false);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
    const loggedIn = !!token;

    /* ============ LOAD PUBLIC FEEDBACK ============ */
    useEffect(() => {
        setLoading(true);
        api.get(`/feedback/public/${pageNumber}/${pageSize}`)
            .then((res) => {
                setFeedback(res.data.feedback);
                setTotalPages(res.data.totalPages);
                setTotalFeedback(res.data.totalFeedback);
                setAvgRating(res.data.avgRating || 0);
                setBreakdown(res.data.breakdown || {});
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [pageNumber, pageSize]);

    /* ============ LOAD MY FEEDBACK ============ */
    useEffect(() => {
        if (!loggedIn) {
            setMyFeedback(null);
            return;
        }
        api.get(`/feedback/mine`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setMyFeedback(res.data.feedback);
                if (res.data.feedback) {
                    setFormRating(res.data.feedback.rating);
                    setFormCategory(res.data.feedback.category || "General");
                    setFormTitle(res.data.feedback.title || "");
                    setFormComment(res.data.feedback.comment || "");
                }
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn, token]);

    /* ============ SUBMIT ============ */
    async function handleSubmit() {
        if (!loggedIn) {
            toast.error("Please login to leave feedback");
            navigate("/signin", { state: { redirectTo: "/" } });
            return;
        }

        if (!formComment.trim() || formComment.trim().length < 5) {
            toast.error("Please write at least 5 characters");
            return;
        }

        try {
            setSaving(true);
            const res = await api.post(
                `/feedback`,
                {
                    rating: formRating,
                    category: formCategory,
                    title: formTitle,
                    comment: formComment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            setMyFeedback(res.data.feedback);
            setShowForm(false);
            setPageNumber(1);

            // refresh list
            const reload = await api.get(
                `/feedback/public/1/${pageSize}`
            );
            setFeedback(reload.data.feedback);
            setTotalPages(reload.data.totalPages);
            setTotalFeedback(reload.data.totalFeedback);
            setAvgRating(reload.data.avgRating || 0);
            setBreakdown(reload.data.breakdown || {});
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to submit feedback"
            );
        } finally {
            setSaving(false);
        }
    }

    /* ============ DELETE MINE ============ */
    async function handleDeleteMine() {
        if (!window.confirm("Delete your feedback?")) return;

        try {
            await api.delete(`/feedback/mine`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Feedback deleted");
            setMyFeedback(null);
            setFormRating(5);
            setFormCategory("General");
            setFormTitle("");
            setFormComment("");

            const reload = await api.get(
                `/feedback/public/1/${pageSize}`
            );
            setFeedback(reload.data.feedback);
            setTotalPages(reload.data.totalPages);
            setTotalFeedback(reload.data.totalFeedback);
            setAvgRating(reload.data.avgRating || 0);
            setBreakdown(reload.data.breakdown || {});
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to delete feedback"
            );
        }
    }

    /* ============ START EDIT ============ */
    function startEdit() {
        if (myFeedback) {
            setFormRating(myFeedback.rating);
            setFormCategory(myFeedback.category || "General");
            setFormTitle(myFeedback.title || "");
            setFormComment(myFeedback.comment || "");
        }
        setShowForm(true);
    }

    return (
        <section className="w-full bg-primary py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* ===== HEADER ===== */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wide mb-3">
                        <span className="w-8 h-0.5 bg-accent"></span>
                        Community
                        <span className="w-8 h-0.5 bg-accent"></span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Real feedback from real shoppers. We read every
                        message — your voice shapes PCFORGE.
                    </p>
                </div>

                {/* ===== SUMMARY CARD ===== */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
                        {/* Left: big number */}
                        <div className="relative flex flex-col items-center justify-center py-8 px-6 bg-gradient-to-br from-accent via-[#00136a] to-[#0a0f3d] text-white">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full blur-[80px]"></div>
                            </div>
                            <div className="relative">
                                <div className="text-6xl font-bold leading-none">
                                    {Number(avgRating).toFixed(1)}
                                </div>
                                <div className="mt-3">
                                    <StarRating
                                        value={avgRating}
                                        size={20}
                                        readOnly
                                    />
                                </div>
                                <div className="text-xs text-white/70 mt-3 uppercase tracking-wide">
                                    {totalFeedback}{" "}
                                    {totalFeedback === 1
                                        ? "review"
                                        : "reviews"}
                                </div>
                            </div>
                        </div>

                        {/* Right: breakdown + CTA */}
                        <div className="p-6 lg:p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const cnt = breakdown[star] || 0;
                                    const pct =
                                        totalFeedback > 0
                                            ? (cnt / totalFeedback) * 100
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
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
                                                {cnt}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-gray-100">
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="text-sm font-semibold text-gray-800">
                                        {myFeedback
                                            ? "Thanks for your feedback!"
                                            : "Have something to share?"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {myFeedback
                                            ? "You can edit or delete your review any time."
                                            : "Rate the site and help us improve."}
                                    </div>
                                </div>

                                {loggedIn ? (
                                    myFeedback ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={startEdit}
                                                className="inline-flex items-center gap-2 px-4 h-[42px] rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                <FiEdit2 size={14} />
                                                Edit
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
                                            onClick={() =>
                                                setShowForm(true)
                                            }
                                            className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                                        >
                                            <FiMessageSquare size={15} />
                                            Write Feedback
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={() =>
                                            navigate("/signin", {
                                                state: {
                                                    redirectTo: "/",
                                                },
                                            })
                                        }
                                        className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                                    >
                                        <FiMessageSquare size={15} />
                                        Login to Review
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== WRITE/EDIT FORM ===== */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-800 text-lg">
                                {myFeedback
                                    ? "Edit your feedback"
                                    : "Share your feedback"}
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 max-w-3xl">
                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    Your Rating
                                </label>
                                <StarRating
                                    value={formRating}
                                    onChange={setFormRating}
                                    size={30}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() =>
                                                setFormCategory(cat)
                                            }
                                            className={`px-3.5 h-[38px] rounded-lg text-xs font-semibold transition-all ${
                                                formCategory === cat
                                                    ? "bg-accent text-white shadow-md shadow-accent/20"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
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
                                    Your Feedback
                                </label>
                                <textarea
                                    value={formComment}
                                    onChange={(e) =>
                                        setFormComment(e.target.value)
                                    }
                                    rows={5}
                                    maxLength={2000}
                                    placeholder="Tell us what you love, what could be better, or anything else..."
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
                                    className="px-5 h-[46px] rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="px-6 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 inline-flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend size={15} />
                                            {myFeedback
                                                ? "Update Feedback"
                                                : "Submit Feedback"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== PUBLIC LIST ===== */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse p-6 rounded-2xl border border-gray-100 bg-white"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && feedback.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FiMessageSquare
                                size={26}
                                className="text-gray-400"
                            />
                        </div>
                        <h3 className="font-semibold text-gray-700 mb-1">
                            No feedback yet
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Be the first to share your experience with
                            PCFORGE.
                        </p>
                    </div>
                )}

                {!loading && feedback.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {feedback.map((fb) => (
                            <FeedbackCard
                                key={fb._id}
                                feedback={fb}
                                isMine={
                                    myFeedback &&
                                    myFeedback._id === fb._id
                                }
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <button
                            disabled={pageNumber === 1}
                            onClick={() =>
                                setPageNumber(pageNumber - 1)
                            }
                            className="px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            Page {pageNumber} of {totalPages}
                        </span>
                        <button
                            disabled={pageNumber === totalPages}
                            onClick={() =>
                                setPageNumber(pageNumber + 1)
                            }
                            className="px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ================= FEEDBACK CARD ================= */
function FeedbackCard({ feedback, isMine }) {
    return (
        <div
            className={`relative bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-4 transition-all hover:shadow-md ${
                isMine
                    ? "border-accent/30 ring-2 ring-accent/10"
                    : "border-gray-100"
            }`}
        >
            {/* Header */}
            <div className="flex items-start gap-3">
                <img
                    src={feedback.userImage || "/default-profile.png"}
                    alt={feedback.userName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                    onError={(e) => {
                        e.target.src = "/default-profile.png";
                    }}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">
                            {feedback.userName}
                        </span>
                        {isMine && (
                            <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wide">
                                You
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating
                            value={feedback.rating}
                            size={12}
                        />
                        <span className="text-[11px] text-gray-400">
                            {formatTimestamp(feedback.date)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Category chip */}
            {feedback.category && feedback.category !== "General" && (
                <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wide">
                        {feedback.category}
                    </span>
                </div>
            )}

            {/* Title */}
            {feedback.title && (
                <h4 className="font-semibold text-gray-800 text-sm leading-snug">
                    {feedback.title}
                </h4>
            )}

            {/* Comment */}
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap flex-1">
                {feedback.comment}
            </p>

            {/* Admin reply */}
            {feedback.adminReply?.body && (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                            <FiCornerUpLeft size={12} />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                            PCFORGE Team
                        </span>
                    </div>
                    <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
                        {feedback.adminReply.body}
                    </p>
                </div>
            )}
        </div>
    );
}