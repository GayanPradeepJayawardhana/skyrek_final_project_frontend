import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import toast from "react-hot-toast";
import {
    FiEye,
    FiTrash2,
    FiMail,
    FiCheckCircle,
    FiClock,
    FiCornerUpLeft,
    FiX,
    FiSend,
    FiFilter,
} from "react-icons/fi";
import formatTimestamp from "../../utils/date-formatter";

const STATUS_STYLES = {
    New: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",
        label: "New",
    },
    Read: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: "Read",
    },
    Replied: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Replied",
    },
    Closed: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
        label: "Closed",
    },
};

export default function AdminContactMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalMessages, setTotalMessages] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            const query =
                statusFilter && statusFilter !== "All"
                    ? `?status=${statusFilter}`
                    : "";

            api
                .get(`/contact/${pageNumber}/${pageSize}${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setMessages(res.data.messages);
                    setTotalMessages(res.data.totalMessages);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message ||
                            "Failed to load messages"
                    );
                    setMessages([]);
                    setTotalPages(1);
                    setTotalMessages(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize, statusFilter]);

    function refresh() {
        setLoading(true);
    }

    async function handleDelete(id, name) {
        if (
            !window.confirm(
                `Delete message from "${name}"? This cannot be undone.`
            )
        ) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Message deleted");
            setSelectedMessage(null);
            refresh();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to delete message"
            );
        }
    }

    async function handleStatusChange(id, newStatus) {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/contact/${id}/status`,
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
            {/* ===== Header ===== */}
            <div className="w-full bg-white shadow-sm rounded-xl flex flex-col sm:flex-row p-5 items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Contact Messages
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalMessages} total{" "}
                        {totalMessages === 1 ? "message" : "messages"}
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
                        className="h-[40px] px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && messages.length === 0 && (
                <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100">
                    <FiMail size={40} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg">
                        No messages{" "}
                        {statusFilter !== "All"
                            ? `with status "${statusFilter}"`
                            : "yet"}
                        .
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        Messages submitted from the contact form appear here.
                    </p>
                </div>
            )}

            {!loading && messages.length > 0 && (
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs uppercase tracking-wide text-gray-500">
                                    <th className="px-5 py-3 font-semibold">
                                        From
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Subject
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
                                {messages.map((msg) => {
                                    const style =
                                        STATUS_STYLES[msg.status] ||
                                        STATUS_STYLES.New;
                                    return (
                                        <tr
                                            key={msg._id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
                                                        {msg.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-gray-800 text-sm truncate">
                                                            {msg.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">
                                                            {msg.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 max-w-[280px]">
                                                <div className="text-sm text-gray-700 font-medium truncate">
                                                    {msg.subject ||
                                                        "(No subject)"}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate mt-0.5">
                                                    {msg.message}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-xs text-gray-500">
                                                    {formatTimestamp(
                                                        msg.date
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                                                    ></span>
                                                    {style.label}
                                                </span>
                                                {msg.replies &&
                                                    msg.replies.length >
                                                        0 && (
                                                        <div className="text-[10px] text-gray-400 mt-1">
                                                            {
                                                                msg.replies
                                                                    .length
                                                            }{" "}
                                                            {msg.replies
                                                                .length === 1
                                                                ? "reply"
                                                                : "replies"}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedMessage(
                                                                msg
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        title="View message"
                                                    >
                                                        <FiEye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                msg._id,
                                                                msg.name
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2
                                                            size={16}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== Pagination ===== */}
            {!loading && totalMessages > 0 && (
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

            {/* ===== Detail + Reply Modal ===== */}
            {selectedMessage && (
                <MessageDetailModal
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    onStatusChange={handleStatusChange}
                    onReplyDelete={(id, name) => handleDelete(id, name)}
                    onReplySent={() => {
                        setSelectedMessage(null);
                        refresh();
                    }}
                />
            )}
        </div>
    );
}

/* ================= DETAIL MODAL WITH REPLY ================= */
function MessageDetailModal({
    message,
    onClose,
    onStatusChange,
    onReplyDelete,
    onReplySent,
}) {
    const [replySubject, setReplySubject] = useState(
        message.subject ? `Re: ${message.subject}` : "Re: Your inquiry"
    );
    const [replyBody, setReplyBody] = useState("");
    const [sending, setSending] = useState(false);
    const [tab, setTab] = useState("message");

    const style = STATUS_STYLES[message.status] || STATUS_STYLES.New;

    async function handleSendReply() {
        if (!replySubject.trim() || !replyBody.trim()) {
            toast.error("Subject and message body are required");
            return;
        }

        try {
            setSending(true);
            const token = localStorage.getItem("token");

            const res = await api.post(
                `/contact/${message._id}/reply`,
                {
                    subject: replySubject.trim(),
                    body: replyBody.trim(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.emailed === false) {
                toast.error(
                    res.data.message ||
                        "Reply saved but email delivery failed"
                );
            } else {
                toast.success("Reply sent to customer");
            }

            onReplySent();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to send reply"
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-accent text-white font-bold flex items-center justify-center flex-shrink-0">
                            {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-800 truncate">
                                {message.name}
                            </h2>
                            <a
                                href={`mailto:${message.email}`}
                                className="text-sm text-accent hover:underline truncate block"
                            >
                                {message.email}
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Meta row */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <FiClock size={12} />
                        {formatTimestamp(message.date)}
                    </div>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${style.bg} ${style.text}`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                        ></span>
                        {style.label}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                        {message.status !== "Read" &&
                            message.status !== "Replied" && (
                                <button
                                    onClick={() =>
                                        onStatusChange(message._id, "Read")
                                    }
                                    className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium transition-colors"
                                >
                                    Mark as Read
                                </button>
                            )}
                        {message.status !== "Closed" && (
                            <button
                                onClick={() =>
                                    onStatusChange(message._id, "Closed")
                                }
                                className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-medium transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setTab("message")}
                        className={`px-6 py-3 text-sm font-semibold transition-colors ${
                            tab === "message"
                                ? "text-accent border-b-2 border-accent"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Message
                    </button>
                    <button
                        onClick={() => setTab("reply")}
                        className={`px-6 py-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
                            tab === "reply"
                                ? "text-accent border-b-2 border-accent"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <FiCornerUpLeft size={14} />
                        Reply
                        {message.replies && message.replies.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold">
                                {message.replies.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {tab === "message" && (
                        <div className="flex flex-col gap-6">
                            {message.subject && (
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                        Subject
                                    </div>
                                    <div className="text-gray-800 font-medium">
                                        {message.subject}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                    Message
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                                    {message.message}
                                </div>
                            </div>

                            {message.replies &&
                                message.replies.length > 0 && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                            Reply History (
                                            {message.replies.length})
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {message.replies.map(
                                                (reply, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <FiCheckCircle
                                                                    size={14}
                                                                    className="text-emerald-600"
                                                                />
                                                                <span className="text-sm font-semibold text-emerald-700">
                                                                    {
                                                                        reply.subject
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] text-gray-400">
                                                                {formatTimestamp(
                                                                    reply.sentAt
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                            {reply.body}
                                                        </p>
                                                        <div className="text-[11px] text-gray-400 mt-2">
                                                            Sent by{" "}
                                                            {reply.sentBy}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}

                    {tab === "reply" && (
                        <div className="flex flex-col gap-5">
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                                <FiMail
                                    size={14}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <div>
                                    This reply will be emailed to{" "}
                                    <strong>{message.email}</strong> and saved
                                    in the message history.
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) =>
                                        setReplySubject(e.target.value)
                                    }
                                    className="block w-full h-[48px] px-4 rounded-xl border border-gray-200 bg-white text-[15px] text-gray-900 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={replyBody}
                                    onChange={(e) =>
                                        setReplyBody(e.target.value)
                                    }
                                    rows={10}
                                    placeholder="Write your reply to the customer..."
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none transition-colors"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button
                                    onClick={() =>
                                        onReplyDelete(
                                            message._id,
                                            message.name
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-4 h-[42px] rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                                >
                                    <FiTrash2 size={14} />
                                    Delete Message
                                </button>

                                <button
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#00136a] transition-all shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend size={15} />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}