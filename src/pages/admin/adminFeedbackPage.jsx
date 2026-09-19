import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import StarRating from "../../components/StarRating";
import formatTimestamp from "../../utils/date-formatter";
import toast from "react-hot-toast";
import {
    FiEye,
    FiTrash2,
    FiFilter,
    FiMessageSquare,
    FiX,
    FiSend,
    FiFlag,
    FiCheckCircle,
} from "react-icons/fi";

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalFeedback, setTotalFeedback] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== "All")
                params.set("status", statusFilter);
            if (categoryFilter && categoryFilter !== "All")
                params.set("category", categoryFilter);
            const qs = params.toString() ? `?${params.toString()}` : "";

            api.get(
                `/feedback/all/${pageNumber}/${pageSize}${qs}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then((res) => {
                    setFeedback(res.data.feedback);
                    setTotalFeedback(res.data.totalFeedback);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message ||
                            "Failed to load feedback"
                    );
                    setFeedback([]);
                    setTotalPages(1);
                    setTotalFeedback(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize, statusFilter, categoryFilter]);

    function refresh() {
        setLoading(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this feedback permanently?")) return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Feedback deleted");
            setSelected(null);
            refresh();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to delete feedback"
            );
        }
    }

    async function handleStatusChange(id, newStatus) {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/feedback/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Marked as ${newStatus}`);
            refresh();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to update status"
            );
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {/* ===== HEADER ================= */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] overflow-hidden">
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[110px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-500 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                            <FiMessageSquare
                                size={24}
                                className="text-white"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                Website Feedback
                            </h1>
                            <p className="text-white/60 text-sm mt-0.5">
                                {totalFeedback} total{" "}
                                {totalFeedback === 1
                                    ? "submission"
                                    : "submissions"}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-3 h-[42px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <FiFilter
                                size={14}
                                className="text-white/70"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPageNumber(1);
                                    setLoading(true);
                                }}
                                className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
                            >
                                <option className="text-gray-800" value="All">
                                    All Statuses
                                </option>
                                <option
                                    className="text-gray-800"
                                    value="Published"
                                >
                                    Published
                                </option>
                                <option
                                    className="text-gray-800"
                                    value="Flagged"
                                >
                                    Flagged
                                </option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 h-[42px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setPageNumber(1);
                                    setLoading(true);
                                }}
                                className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
                            >
                                <option className="text-gray-800" value="All">
                                    All Categories
                                </option>
                                {[
                                    "General",
                                    "Website",
                                    "Checkout",
                                    "Delivery",
                                    "Support",
                                    "Other",
                                ].map((c) => (
                                    <option
                                        key={c}
                                        className="text-gray-800"
                                        value={c}
                                    >
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {/* ===== EMPTY STATE ===== */}
            {!loading && feedback.length === 0 && (
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                        <FiMessageSquare
                            size={32}
                            className="text-accent"
                        />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        No feedback{" "}
                        {statusFilter !== "All"
                            ? `with status "${statusFilter}"`
                            : "yet"}
                    </h2>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                        Feedback submitted by customers will appear here.
                    </p>
                </div>
            )}

            {/* ===== TABLE ===== */}
            {!loading && feedback.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs uppercase tracking-wide text-gray-500">
                                    <th className="px-5 py-3 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Category
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Rating
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Feedback
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
                                {feedback.map((fb) => (
                                    <tr
                                        key={fb._id}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        fb.userImage ||
                                                        "/default-profile.png"
                                                    }
                                                    alt={fb.userName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/default-profile.png";
                                                    }}
                                                />
                                                <div className="min-w-0 max-w-[160px]">
                                                    <div className="text-sm font-medium text-gray-800 truncate">
                                                        {fb.userName}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 truncate">
                                                        {fb.userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-wide">
                                                {fb.category || "General"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StarRating
                                                value={fb.rating}
                                                size={12}
                                            />
                                        </td>
                                        <td className="px-5 py-4 max-w-[320px]">
                                            <div className="text-sm text-gray-700 truncate">
                                                {fb.title && (
                                                    <span className="font-medium">
                                                        {fb.title} —{" "}
                                                    </span>
                                                )}
                                                {fb.comment}
                                            </div>
                                            {fb.adminReply?.body && (
                                                <div className="text-[11px] text-emerald-600 mt-0.5 inline-flex items-center gap-1">
                                                    <FiCheckCircle
                                                        size={10}
                                                    />
                                                    Admin replied
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs text-gray-500">
                                                {formatTimestamp(fb.date)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    fb.status === "Flagged"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        fb.status ===
                                                        "Flagged"
                                                            ? "bg-amber-500"
                                                            : "bg-emerald-500"
                                                    }`}
                                                ></span>
                                                {fb.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelected(fb)
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                    title="View / Reply"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(fb._id)
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

            {/* ===== PAGINATION ===== */}
            {!loading && totalFeedback > 0 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageNumber(1);
                            setLoading(true);
                        }}
                        className="h-[38px] px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm focus:border-accent focus:outline-none cursor-pointer"
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
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {selected && (
                <FeedbackDetailModal
                    feedback={selected}
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

/* ================= MODAL ================= */
function FeedbackDetailModal({
    feedback,
    onClose,
    onDelete,
    onStatusChange,
    onReplied,
}) {
    const [replyBody, setReplyBody] = useState(
        feedback.adminReply?.body || ""
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
                `/feedback/${feedback._id}/reply`,
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
                            src={
                                feedback.userImage ||
                                "/default-profile.png"
                            }
                            alt={feedback.userName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "/default-profile.png";
                            }}
                        />
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-800 truncate">
                                {feedback.userName}
                            </h2>
                            <div className="text-xs text-gray-400 truncate">
                                {feedback.userEmail}
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

                {/* Meta strip */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                    <StarRating value={feedback.rating} size={16} />
                    <span className="text-sm font-semibold text-gray-800">
                        {Number(feedback.rating).toFixed(1)} / 5
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wide">
                        {feedback.category || "General"}
                    </span>
                    <span
                        className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
                            feedback.status === "Flagged"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {feedback.status}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {feedback.title && (
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            {feedback.title}
                        </h3>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                        {feedback.comment}
                    </p>

                    {feedback.adminReply?.body && (
                        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 mb-5">
                            <div className="flex items-center gap-2 mb-2">
                                <FiCheckCircle
                                    size={14}
                                    className="text-emerald-600"
                                />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                                    Current Reply
                                </span>
                                {feedback.adminReply.repliedAt && (
                                    <span className="text-[11px] text-gray-400">
                                        {formatTimestamp(
                                            feedback.adminReply.repliedAt
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-emerald-900 whitespace-pre-wrap">
                                {feedback.adminReply.body}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {feedback.adminReply?.body
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

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => onDelete(feedback._id)}
                        className="inline-flex items-center gap-2 px-4 h-[42px] rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        <FiTrash2 size={14} />
                        Delete
                    </button>

                    <button
                        onClick={() =>
                            onStatusChange(
                                feedback._id,
                                feedback.status === "Flagged"
                                    ? "Published"
                                    : "Flagged"
                            )
                        }
                        className="inline-flex items-center gap-2 px-4 h-[42px] rounded-lg border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-50 transition-colors"
                    >
                        <FiFlag size={14} />
                        {feedback.status === "Flagged"
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
                                    {feedback.adminReply?.body
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