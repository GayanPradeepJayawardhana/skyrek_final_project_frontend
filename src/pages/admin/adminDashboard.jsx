import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
    FiShoppingCart,
    FiPackage,
    FiUsers,
    FiTrendingUp,
    FiPlus,
    FiArrowRight,
    FiMail,
    FiStar,
    FiActivity,
    FiDollarSign,
    FiMessageSquare,
} from "react-icons/fi";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0,
        revenue: 0,
        messages: 0,
        reviews: 0,
        siteFeedback: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            api
                .get("/orders/1/1", { headers })
                .catch(() => ({ data: {} })),
            api
                .get("/products", { headers })
                .catch(() => ({ data: [] })),
            api
                .get("/users/all/1/1", { headers })
                .catch(() => ({ data: {} })),
            api
                .get("/contact/unread-count", { headers })
                .catch(() => ({ data: {} })),
            api
                .get("/reviews/all/1/1", { headers })
                .catch(() => ({ data: {} })),
            api
                .get("/feedback/summary")
                .catch(() => ({ data: {} })),
        ])
            .then(
                ([
                    ordersRes,
                    productsRes,
                    usersRes,
                    msgRes,
                    reviewRes,
                    fbRes,
                ]) => {
                    setStats({
                        orders: ordersRes.data.totalOrders || 0,
                        products: Array.isArray(productsRes.data)
                            ? productsRes.data.length
                            : 0,
                        users: usersRes.data.totalUsers || 0,
                        revenue: 0,
                        messages: msgRes.data.unreadCount || 0,
                        reviews: reviewRes.data.totalReviews || 0,
                        siteFeedback: fbRes.data.reviewCount || 0,
                    });
                    setLoading(false);
                }
            )
            .catch(() => setLoading(false));
    }, []);

    const cards = [
        {
            label: "Total Orders",
            value: stats.orders,
            icon: FiShoppingCart,
            bg: "bg-blue-50",
            text: "text-blue-600",
            gradient: "from-blue-500 to-blue-600",
            link: "/admin",
        },
        {
            label: "Total Products",
            value: stats.products,
            icon: FiPackage,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            gradient: "from-emerald-500 to-emerald-600",
            link: "/admin/products",
        },
        {
            label: "Total Users",
            value: stats.users,
            icon: FiUsers,
            bg: "bg-violet-50",
            text: "text-violet-600",
            gradient: "from-violet-500 to-violet-600",
            link: "/admin/users",
        },
        {
            label: "Unread Messages",
            value: stats.messages,
            icon: FiMail,
            bg: "bg-amber-50",
            text: "text-amber-600",
            gradient: "from-amber-500 to-amber-600",
            link: "/admin/contact-messages",
        },
    ];

    const secondary = [
        {
            label: "Product Reviews",
            value: stats.reviews,
            icon: FiStar,
            bg: "bg-rose-50",
            text: "text-rose-600",
            link: "/admin/reviews",
        },
        {
            label: "Site Feedback",
            value: stats.siteFeedback,
            icon: FiMessageSquare,
            bg: "bg-indigo-50",
            text: "text-indigo-600",
            link: "/admin/feedback",
        },
        {
            label: "Site Status",
            value: "Healthy",
            icon: FiActivity,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            link: "#",
        },
    ];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* ================= HERO ================= */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] overflow-hidden">
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full blur-[110px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500 rounded-full blur-[130px]"></div>
                </div>

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live dashboard
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            Welcome back, Admin 👋
                        </h1>
                        <p className="text-white/60 text-sm max-w-lg leading-relaxed">
                            Here's a snapshot of your store today. Track
                            orders, monitor reviews, and manage your team from
                            one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/admin/add-product"
                            className="group inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-white text-[#001a84] font-semibold text-sm hover:bg-cyan-50 transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5"
                        >
                            <FiPlus size={16} />
                            Add Product
                        </Link>
                        <Link
                            to="/admin/contact-messages"
                            className="inline-flex items-center gap-2 px-5 h-[46px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                        >
                            <FiMail size={16} />
                            Inbox
                            {stats.messages > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                    {stats.messages > 99
                                        ? "99+"
                                        : stats.messages}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ================= PRIMARY STAT CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        to={card.link}
                        className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                    >
                        <div
                            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity`}
                        ></div>

                        <div className="relative flex items-start justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}
                            >
                                <card.icon
                                    size={22}
                                    className={card.text}
                                />
                            </div>
                            <FiArrowRight
                                size={16}
                                className="text-gray-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <div className="text-3xl font-bold text-gray-800">
                                {loading ? "—" : card.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">
                                {card.label}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ================= SECONDARY STRIP ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {secondary.map((card, i) => (
                    <Link
                        key={i}
                        to={card.link}
                        className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        <div
                            className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}
                        >
                            <card.icon
                                size={18}
                                className={card.text}
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                {card.label}
                            </div>
                            <div className="text-base font-bold text-gray-800 truncate">
                                {loading ? "—" : card.value}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-7">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <FiTrendingUp size={18} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                            Quick Actions
                        </h3>
                        <p className="text-xs text-gray-500">
                            Common tasks to keep the store running smoothly
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        {
                            to: "/admin/add-product",
                            icon: FiPlus,
                            title: "Add Product",
                            desc: "Create a new product listing",
                        },
                        {
                            to: "/admin",
                            icon: FiShoppingCart,
                            title: "Manage Orders",
                            desc: "View and update orders",
                        },
                        {
                            to: "/admin/users",
                            icon: FiUsers,
                            title: "Manage Users",
                            desc: "Roles, blocking, and more",
                        },
                        {
                            to: "/admin/contact-messages",
                            icon: FiMail,
                            title: "Contact Messages",
                            desc: "Reply to customer inquiries",
                        },
                        {
                            to: "/admin/reviews",
                            icon: FiStar,
                            title: "Product Reviews",
                            desc: "Moderate and reply to reviews",
                        },
                        {
                            to: "/admin/feedback",
                            icon: FiMessageSquare,
                            title: "Website Feedback",
                            desc: "Read what customers think",
                        },
                        {
                            to: "/admin/settings",
                            icon: FiActivity,
                            title: "Store Settings",
                            desc: "Security and preferences",
                        },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            to={action.to}
                            className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-accent/30 hover:bg-accent-light/50 transition-all"
                        >
                            <div className="w-11 h-11 rounded-xl bg-accent/10 group-hover:bg-accent group-hover:text-white text-accent flex items-center justify-center transition-colors flex-shrink-0">
                                <action.icon size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-accent transition-colors">
                                    {action.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {action.desc}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}