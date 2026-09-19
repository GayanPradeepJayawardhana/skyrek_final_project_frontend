import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import StarRating from "../../components/StarRating";
import formatTimestamp from "../../utils/date-formatter";
import toast from "react-hot-toast";
import {
    FiEye,
    FiTrash2,
    FiCornerUpLeft,
    FiFilter,
    FiMessageSquare,
    FiX,
    FiSend,
    FiFlag,
    FiCheckCircle,
} from "react-icons/fi";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== "All")
                params.set("status", statusFilter);
            const qs = params.toString() ? `?${params.toString()}` : "";

            api.get(
                `/reviews/all/${pageNumber}/${pageSize}${qs}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then((res) => {
                    setReviews(res.data.reviews);
                    setTotalReviews(res.data.totalReviews);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message ||
                            "Failed to load reviews"
                    );
                    setReviews([]);
                    setTotalPages(1);
                    setTotalReviews(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize, statusFilter]);

    function refresh() {
        setLoading(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this review permanently?")) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Review deleted");
            setSelected(null);
            refresh();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to delete review"
            );
        }
    }

    async function handleStatusChange(id, newStatus) {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/reviews/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Marked as ${newStatus}`);
            refresh();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to update status"
            );
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="w-full bg-white shadow-sm rounded-xl flex flex-col sm:flex-row p-5 items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Product Reviews
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalReviews} total{" "}
                        {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <FiFilter size={16} className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPageNumber(1);
                            setLoading(true);
                        }}
                        className="h-[40px] px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-accent focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Flagged">Flagged</option>
                    </select>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && reviews.length === 0 && (
                <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100">
                    <FiMessageSquare
                        size={40}
                        className="text-gray-300 mb-3"
                    />
                    <p className="text-gray-500 text-lg">
                        No reviews{" "}
                        {statusFilter !== "All"
                            ? `with status "${statusFilter}"`
                            : "yet"}
                        .
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        Reviews submitted by customers appear here.
                    </p>
                </div>
            )}

            {!loading && reviews.length > 0 && (
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs uppercase tracking-wide text-gray-500">
                                    <th className="px-5 py-3 font-semibold">
                                        Product
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Rating
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Review
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Date
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((r) => (
                                    <tr
                                        key={r._id}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Product */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={
                                                            r.productImage
                                                        }
                                                        alt={r.productName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/default-product-1.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0 max-w-[180px]">
                                                    <div className="text-sm font-medium text-gray-800 truncate">
                                                        {r.productName}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400">
                                                        {r.productId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        r.userImage ||
                                                        "/default-profile.png"
                                                    }
                                                    alt={r.userName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/default-profile.png";
                                                    }}
                                                />
                                                <div className="min-w-0 max-w-[140px]">
                                                    <div className="text-sm text-gray-700 truncate">
                                                        {r.userName}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 truncate">
                                                        {r.userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rating */}
                                        <td className="px-5 py-4">
                                            <StarRating
                                                value={r.rating}
                                                size={12}
                                            />
                                        </td>

                                        {/* Review snippet */}
                                        <td className="px-5 py-4 max-w-[280px]">
                                            <div className="text-sm text-gray-700 truncate">
                                                {r.title && (
                                                    <span className="font-medium">
                                                        {r.title} —{" "}
                                                    </span>
                                                )}
                                                {r.comment}
                                            </div>
                                            {r.adminReply?.body && (
                                                <div className="text-[11px] text-emerald-600 mt-0.5 inline-flex items-center gap-1">
                                                    <FiCheckCircle
                                                        size={10}
                                                    />
                                                    Admin replied
                                                </div>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4">
                                            <div className="text-xs text-gray-500">
                                                {formatTimestamp(r.date)}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    r.status === "Flagged"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        r.status ===
                                                        "Flagged"
                                                            ? "bg-amber-500"
                                                            : "bg-emerald-500"
                                                    }`}
                                                ></span>
                                                {r.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelected(r)
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                    title="View / Reply"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(r._id)
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalReviews > 0 && (
                <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageNumber(1);
                            setLoading(true);
                        }}
                        className="h-[36px] px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm focus:border-accent focus:outline-none cursor-pointer"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={pageNumber === 1}
                            onClick={() => {
                                setPageNumber(pageNumber - 1);
                                setLoading(true);
                            }}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            Page {pageNumber} of {totalPages}
                        </span>
                        <button
                            disabled={pageNumber === totalPages}
                            onClick={() => {
                                setPageNumber(pageNumber + 1);
                                setLoading(true);
                            }}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Detail / Reply modal */}
            {selected && (
                <ReviewDetailModal
                    review={selected}
                    onClose={() => setSelected(null)}
                    onDelete={(id) => handleDelete(id)}
                    onStatusChange={(id, status) =>
                        handleStatusChange(id, status)
                    }
                    onReplied={() => {
                        setSelected(null);
                        refresh();
                    }}
                />
            )}
        </div>
    );
}

/* ================= DETAIL MODAL ================= */
function ReviewDetailModal({
    review,
    onClose,
    onDelete,
    onStatusChange,
    onReplied,
}) {
    const [replyBody, setReplyBody] = useState(
        review.adminReply?.body || ""
    );
    const [sending, setSending] = useState(false);

    async function handleSendReply() {
        if (!replyBody.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }

        try {
            setSending(true);
            const token = localStorage.getItem("token");
            await api.post(
                `/reviews/${review._id}/reply`,
                { body: replyBody.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Reply saved");
            onReplied();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to save reply"
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 min-w-0">
                        <img
                            src={review.userImage || "/default-profile.png"}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "/default-profile.png";
                            }}
                        />
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-800 truncate">
                                {review.userName}
                            </h2>
                            <div className="text-xs text-gray-400 truncate">
                                {review.userEmail}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Product strip */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-9 h-9 rounded-lg object-cover"
                        onError={(e) => {
                            e.target.src = "/default-product-1.png";
                        }}
                    />
                    <div className="text-sm font-medium text-gray-700 truncate">
                        {review.productName}
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                        {formatTimestamp(review.date)}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Stars + title */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <StarRating value={review.rating} size={18} />
                        <span className="text-sm font-semibold text-gray-800">
                            {Number(review.rating).toFixed(1)} / 5
                        </span>
                        <span
                            className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
                                review.status === "Flagged"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-emerald-50 text-emerald-700"
                            }`}
                        >
                            {review.status}
                        </span>
                    </div>

                    {review.title && (
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            {review.title}
                        </h3>
                    )}

                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                        {review.comment}
                    </p>

                    {/* Existing admin reply */}
                    {review.adminReply?.body && (
                        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 mb-5">
                            <div className="flex items-center gap-2 mb-2">
                                <FiCheckCircle
                                    size={14}
                                    className="text-emerald-600"
                                />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                                    Current Reply
                                </span>
                                {review.adminReply.repliedAt && (
                                    <span className="text-[11px] text-gray-400">
                                        {formatTimestamp(
                                            review.adminReply.repliedAt
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-emerald-900 whitespace-pre-wrap">
                                {review.adminReply.body}
                            </p>
                        </div>
                    )}

                    {/* Reply form */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {review.adminReply?.body
                                ? "Update Reply"
                                : "Reply to Customer"}
                        </label>
                        <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            rows={4}
                            placeholder="Write a public reply visible to all customers..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => onDelete(review._id)}
                        className="inline-flex items-center gap-2 px-4 h-[42px] rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        <FiTrash2 size={14} />
                        Delete
                    </button>

                    <button
                        onClick={() =>
                            onStatusChange(
                                review._id,
                                review.status === "Flagged"
                                    ? "Published"
                                    : "Flagged"
                            )
                        }
                        className="inline-flex items-center gap-2 px-4 h-[42px] rounded-lg border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors"
                    >
                        <FiFlag size={14} />
                        {review.status === "Flagged"
                            ? "Unflag"
                            : "Flag"}
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 h-[42px] rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-white transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSendReply}
                            disabled={sending}
                            className="inline-flex items-center gap-2 px-5 h-[42px] rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 disabled:opacity-60"
                        >
                            {sending ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSend size={14} />
                                    {review.adminReply?.body
                                        ? "Update Reply"
                                        : "Send Reply"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}