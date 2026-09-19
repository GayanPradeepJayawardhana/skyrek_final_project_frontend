import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import getFormattedPrice from "../utils/price-formatter";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiPackage,
    FiCalendar,
    FiAlertTriangle,
    FiCheckCircle,
    FiXCircle,
} from "react-icons/fi";

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-violet-50 text-violet-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
    "Cancel Requested": "bg-orange-50 text-orange-700",
};

export default function AdminOrderDataModal({ order, refresh, isAdmin }) {
    const [isOpen, setIsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [resolving, setResolving] = useState(false);

    function updateOrderStatus(newStatus) {
        const token = localStorage.getItem("token");
        setUpdating(true);

        api.put(
            "/orders/" + order.orderId,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => {
                toast.success("Order status updated");
                refresh();
            })
            .catch((err) => {
                console.log(err);
                toast.error(
                    err?.response?.data?.message ||
                        "Failed to update order status"
                );
            })
            .finally(() => setUpdating(false));
    }

    function resolveCancellation(approve) {
        const token = localStorage.getItem("token");
        setResolving(true);

        api.put(
            `/orders/${order.orderId}/resolve-cancellation`,
            { approve },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((res) => {
                toast.success(res.data.message);
                setIsOpen(false);
                refresh();
            })
            .catch((err) => {
                toast.error(
                    err?.response?.data?.message ||
                        "Failed to resolve cancellation"
                );
            })
            .finally(() => setResolving(false));
    }

    const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
    const isCancelRequested = order.status === "Cancel Requested";
    const isCancelled = order.status === "Cancelled";

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                title="View order details"
            >
                <IoMdEye size={18} />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-br from-accent to-[#0a0f3d] px-6 py-5 text-white">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                    <FiPackage size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-white/60 uppercase tracking-wider">
                                        Order ID
                                    </div>
                                    <h2 className="text-xl font-bold">
                                        {order.orderId}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation request banner (admin only) */}
                        {isAdmin && isCancelRequested && (
                            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <FiAlertTriangle
                                            size={16}
                                            className="text-orange-600"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-orange-800">
                                            Cancellation Request
                                        </div>
                                        <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                            <span className="font-semibold">
                                                Reason:
                                            </span>{" "}
                                            {order.cancellation?.reason ||
                                                "No reason provided"}
                                        </p>
                                        {order.cancellation?.requestedAt && (
                                            <p className="text-[11px] text-orange-600/80 mt-1">
                                                Requested at{" "}
                                                {new Date(
                                                    order.cancellation.requestedAt
                                                ).toLocaleString()}
                                            </p>
                                        )}

                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() =>
                                                    resolveCancellation(true)
                                                }
                                                disabled={resolving}
                                                className="inline-flex items-center gap-1.5 px-3 h-[34px] rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-60"
                                            >
                                                <FiCheckCircle size={13} />
                                                Approve Cancel
                                            </button>
                                            <button
                                                onClick={() =>
                                                    resolveCancellation(false)
                                                }
                                                disabled={resolving}
                                                className="inline-flex items-center gap-1.5 px-3 h-[34px] rounded-lg bg-white border border-orange-200 text-orange-700 text-xs font-semibold hover:bg-orange-50 disabled:opacity-60"
                                            >
                                                <FiXCircle size={13} />
                                                Reject Request
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cancelled info banner */}
                        {isCancelled && (
                            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <FiXCircle
                                            size={16}
                                            className="text-red-600"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-red-800">
                                            Order Cancelled
                                        </div>
                                        {order.cancellation?.reason && (
                                            <p className="text-xs text-red-700 mt-1">
                                                <span className="font-semibold">
                                                    Reason:
                                                </span>{" "}
                                                {order.cancellation.reason}
                                            </p>
                                        )}
                                        {order.cancellation?.resolvedAt && (
                                            <p className="text-[11px] text-red-600/80 mt-1">
                                                Cancelled at{" "}
                                                {new Date(
                                                    order.cancellation.resolvedAt
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Body */}
                        <div className="max-h-[70vh] overflow-y-auto">
                            {/* Customer + Shipping */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <FiUser
                                                size={16}
                                                className="text-accent"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                                                Customer
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800 truncate">
                                                {order.firstName}{" "}
                                                {order.lastName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <FiMail
                                                size={16}
                                                className="text-accent"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                                                Email
                                            </div>
                                            <div className="text-sm text-gray-700 truncate">
                                                {order.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <FiPhone
                                                size={16}
                                                className="text-accent"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                                                Phone
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {order.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <FiMapPin
                                                size={16}
                                                className="text-accent"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                                                Address
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {order.addressLine1}
                                                {order.addressLine2 &&
                                                    `, ${order.addressLine2}`}
                                                , {order.city}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <FiCalendar
                                                size={16}
                                                className="text-accent"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                                                Status
                                            </div>
                                            {isAdmin &&
                                            !isCancelRequested &&
                                            !isCancelled ? (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        updateOrderStatus(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={updating}
                                                    className={`text-sm font-semibold rounded-lg px-3 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer ${statusStyle}`}
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="Processing">
                                                        Processing
                                                    </option>
                                                    <option value="Shipped">
                                                        Shipped
                                                    </option>
                                                    <option value="Delivered">
                                                        Delivered
                                                    </option>
                                                </select>
                                            ) : (
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle}`}
                                                >
                                                    {order.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                        Items ({order.items.length})
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                                <img
                                                    src={
                                                        item.product.image ||
                                                        "/default-product-1.png"
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror =
                                                            null;
                                                        e.target.src =
                                                            "/default-product-1.png";
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                    {item.product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-accent font-semibold">
                                                        {getFormattedPrice(
                                                            item.product.price
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        × {item.qty}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                    Subtotal
                                                </div>
                                                <div className="text-sm font-bold text-gray-800">
                                                    {getFormattedPrice(
                                                        item.product.price *
                                                            item.qty
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Total Amount
                                    </span>
                                    <span className="text-xl font-bold text-accent">
                                        {getFormattedPrice(
                                            order.totalAmount
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}