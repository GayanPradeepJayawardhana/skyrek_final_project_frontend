import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import getFormattedPrice from "../../utils/price-formatter";
import formatTimestamp from "../../utils/date-formatter";
import AdminOrderDataModal from "../../components/orderDataModal";
import toast from "react-hot-toast";
import {
    FiShoppingCart,
    FiClock,
    FiPackage,
    FiMail,
    FiMapPin,
    FiAlertTriangle,
} from "react-icons/fi";

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Processing: "bg-blue-50 text-blue-700 border-blue-100",
    Shipped: "bg-violet-50 text-violet-700 border-violet-100",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
    "Cancel Requested": "bg-orange-50 text-orange-700 border-orange-100",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            api
                .get("/orders/" + pageNumber + "/" + pageSize, {
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

    const cancelRequestedCount = orders.filter(
        (o) => o.status === "Cancel Requested"
    ).length;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* ================= HERO ================= */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] overflow-hidden">
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[110px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-500 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                            <FiShoppingCart
                                size={24}
                                className="text-white"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                All Orders
                            </h1>
                            <p className="text-white/60 text-sm mt-0.5">
                                {totalOrders}{" "}
                                {totalOrders === 1 ? "order" : "orders"} placed
                            </p>
                        </div>
                    </div>

                    {cancelRequestedCount > 0 && (
                        <div className="inline-flex items-center gap-2 px-4 h-[44px] rounded-xl bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 text-white text-sm font-semibold">
                            <FiAlertTriangle
                                size={16}
                                className="text-orange-300"
                            />
                            {cancelRequestedCount} cancel request
                            {cancelRequestedCount !== 1 ? "s" : ""} pending
                        </div>
                    )}
                </div>
            </div>

            {loading && <LoadingScreen />}

            {/* ================= EMPTY STATE ================= */}
            {!loading && orders.length === 0 && (
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                        <FiPackage size={32} className="text-accent" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        No orders yet
                    </h2>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                        Orders placed by customers will appear here.
                    </p>
                </div>
            )}

            {/* ================= ORDERS LIST ================= */}
            {!loading && orders.length > 0 && (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => {
                        const statusStyle =
                            STATUS_STYLES[order.status] ||
                            STATUS_STYLES.Pending;
                        const isCancelRequested =
                            order.status === "Cancel Requested";

                        return (
                            <div
                                key={order.orderId}
                                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
                                    isCancelRequested
                                        ? "border-orange-200 ring-2 ring-orange-100"
                                        : "border-gray-100 hover:border-gray-200"
                                }`}
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
                                                        {isCancelRequested && (
                                                            <FiAlertTriangle
                                                                size={10}
                                                            />
                                                        )}
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-800 text-sm mt-1 truncate">
                                                    {order.firstName}{" "}
                                                    {order.lastName}
                                                </h3>
                                                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 mt-1">
                                                    <span className="inline-flex items-center gap-1">
                                                        <FiMail size={11} />
                                                        {order.email}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <FiMapPin size={11} />
                                                        {order.city}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <FiClock size={11} />
                                                        {formatTimestamp(
                                                            order.date
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Cancellation reason preview */}
                                                {isCancelRequested &&
                                                    order.cancellation
                                                        ?.reason && (
                                                        <div className="mt-2 inline-flex items-start gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-[11px] text-orange-700 max-w-full">
                                                            <FiAlertTriangle
                                                                size={11}
                                                                className="mt-0.5 flex-shrink-0"
                                                            />
                                                            <span className="truncate">
                                                                {
                                                                    order
                                                                        .cancellation
                                                                        .reason
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Right: Total + actions */}
                                        <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 pl-16 lg:pl-0">
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
                                            <AdminOrderDataModal
                                                isAdmin={true}
                                                order={order}
                                                refresh={() =>
                                                    setLoading(true)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ================= PAGINATION ================= */}
            {!loading && totalOrders > 0 && (
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
        </div>
    );
}