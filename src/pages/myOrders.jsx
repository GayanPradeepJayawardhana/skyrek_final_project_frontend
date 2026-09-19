import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import getFormattedPrice from "../utils/price-formatter";
import formatTimestamp from "../utils/date-formatter";
import AdminOrderDataModal from "../components/orderDataModal";
import toast from "react-hot-toast";
import {
    FiPackage,
    FiShoppingBag,
    FiClock,
    FiXCircle,
    FiX,
} from "react-icons/fi";

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Processing: "bg-blue-50 text-blue-700 border-blue-100",
    Shipped: "bg-violet-50 text-violet-700 border-violet-100",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
    "Cancel Requested": "bg-orange-50 text-orange-700 border-orange-100",
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Cancellation modal state
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login to view your orders");
                window.location.href = "/signin";
                return;
            }

            api.get("/orders/" + pageNumber + "/" + pageSize, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    setOrders(res.data.orders);
                    setTotalOrders(res.data.totalOrders);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load orders:", err);
                    toast.error(
                        err?.response?.data?.message ||
                            "Failed to load orders"
                    );
                    setOrders([]);
                    setTotalPages(1);
                    setTotalOrders(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize]);

    function handleCancelOrder(order) {
        setCancelModal(order);
        setCancelReason("");
    }

    async function submitCancellation() {
        if (!cancelReason.trim() || cancelReason.trim().length < 5) {
            toast.error("Please provide a reason (min 5 characters)");
            return;
        }

        try {
            setCancelling(true);
            const token = localStorage.getItem("token");

            const res = await api.put(
                `/orders/${cancelModal.orderId}/cancel`,
                { reason: cancelReason.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            setCancelModal(null);
            setCancelReason("");
            setLoading(true); // refresh
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to cancel order"
            );
        } finally {
            setCancelling(false);
        }
    }

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            {/* ===== HEADER ===== */}
            <div className="w-full bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <FiShoppingBag
                                size={24}
                                className="text-white"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                My Orders
                            </h1>
                            <p className="text-white/60 text-sm mt-0.5">
                                {totalOrders}{" "}
                                {totalOrders === 1 ? "order" : "orders"} placed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
                {loading && <LoadingScreen />}

                {/* Empty state */}
                {!loading && orders.length === 0 && (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center px-6">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                            <FiPackage size={32} className="text-accent" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                            You haven't placed any orders. Start browsing our
                            products and place your first order!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                        >
                            <FiShoppingBag size={16} />
                            Browse Products
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                {!loading && orders.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => {
                            const statusStyle =
                                STATUS_STYLES[order.status] ||
                                STATUS_STYLES.Pending;
                            const canCancel =
                                order.status === "Pending" ||
                                order.status === "Processing";

                            return (
                                <div
                                    key={order.orderId}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5 lg:p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Left: Order info */}
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                    <FiPackage
                                                        size={20}
                                                        className="text-accent"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="font-bold text-accent text-sm">
                                                            {order.orderId}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-800 text-sm mt-1 truncate">
                                                        {order.firstName}{" "}
                                                        {order.lastName}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                        <span className="inline-flex items-center gap-1">
                                                            <FiClock
                                                                size={12}
                                                            />
                                                            {formatTimestamp(
                                                                order.date
                                                            )}
                                                        </span>
                                                        <span>
                                                            • {order.city}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Total + actions */}
                                            <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 pl-16 lg:pl-0 flex-wrap">
                                                <div className="text-right">
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                        Total
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-800">
                                                        {getFormattedPrice(
                                                            order.totalAmount
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Cancel button */}
                                                    {canCancel && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="px-4 h-[42px] rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                                                        >
                                                            <FiXCircle
                                                                size={14}
                                                            />
                                                            Cancel Order
                                                        </button>
                                                    )}

                                                    <AdminOrderDataModal
                                                        isAdmin={false}
                                                        order={order}
                                                        refresh={() =>
                                                            setLoading(true)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalOrders > 0 && (
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
            </div>

            {/* ===== CANCEL MODAL ===== */}
            {cancelModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => !cancelling && setCancelModal(null)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-gradient-to-br from-red-500 to-red-700 px-6 py-5 text-white">
                            <button
                                onClick={() =>
                                    !cancelling && setCancelModal(null)
                                }
                                disabled={cancelling}
                                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                                <FiX size={18} />
                            </button>
                            <h2 className="text-lg font-bold">
                                Cancel Order
                            </h2>
                            <p className="text-white/70 text-xs mt-1">
                                Order {cancelModal.orderId}
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700 mb-4">
                                {cancelModal.status === "Pending"
                                    ? "This order will be cancelled immediately and stock will be restored."
                                    : "Your request will be reviewed by an admin before the order is cancelled."}
                            </div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason for cancellation{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(
                                        e.target.value.slice(0, 500)
                                    )
                                }
                                rows={4}
                                placeholder="Please tell us why you're cancelling this order..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none"
                            ></textarea>
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {cancelReason.length}/500
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setCancelModal(null)}
                                disabled={cancelling}
                                className="flex-1 h-[46px] rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-white disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={submitCancellation}
                                disabled={cancelling}
                                className="flex-1 h-[46px] rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                            >
                                {cancelling ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Cancelling...
                                    </>
                                ) : (
                                    "Confirm Cancel"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}