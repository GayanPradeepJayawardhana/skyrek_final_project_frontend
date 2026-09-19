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
} from "react-icons/fi";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            api.get("/orders/1/1", { headers }).catch(() => ({ data: {} })),
            api.get("/products", { headers }).catch(() => ({ data: [] })),
            api
                .get("/users/all/1/1", { headers })
                .catch(() => ({ data: {} })),
        ])
            .then(([ordersRes, productsRes, usersRes]) => {
                setStats({
                    orders: ordersRes.data.totalOrders || 0,
                    products: Array.isArray(productsRes.data)
                        ? productsRes.data.length
                        : 0,
                    users: usersRes.data.totalUsers || 0,
                    revenue: 0, // not tracked on backend yet
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const cards = [
        {
            label: "Total Orders",
            value: stats.orders,
            icon: FiShoppingCart,
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
            link: "/admin",
        },
        {
            label: "Total Products",
            value: stats.products,
            icon: FiPackage,
            color: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            link: "/admin/products",
        },
        {
            label: "Total Users",
            value: stats.users,
            icon: FiUsers,
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-50",
            text: "text-purple-600",
            link: "/admin/users",
        },
        {
            label: "This Month Revenue",
            value: "LKR 0.00",
            icon: FiTrendingUp,
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50",
            text: "text-amber-600",
            link: "#",
        },
    ];

    return (
        <div className="w-full h-full overflow-y-auto pb-8 animate-fade-in">
            {/* Welcome banner */}
            <div className="w-full bg-gradient-to-r from-accent to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-accent/20">
                <h2 className="text-2xl font-bold mb-1">Welcome back, Admin 👋</h2>
                <p className="text-white/80 text-sm">
                    Here's what's happening in your store today.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        to={card.link}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`w-11 h-11 rounded-lg ${card.bg} flex items-center justify-center`}
                            >
                                <card.icon size={20} className={card.text} />
                            </div>
                            <FiArrowRight
                                size={16}
                                className="text-gray-300 group-hover:text-accent transition-colors"
                            />
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            {loading ? "—" : card.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                            {card.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Link
                        to="/admin/add-product"
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent-light transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <FiPlus size={18} className="text-accent" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-accent text-sm">
                                Add Product
                            </div>
                            <div className="text-xs text-gray-500">
                                Create a new product listing
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin"
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent-light transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <FiShoppingCart size={18} className="text-accent" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-accent text-sm">
                                Manage Orders
                            </div>
                            <div className="text-xs text-gray-500">
                                View and update orders
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent-light transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <FiUsers size={18} className="text-accent" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-accent text-sm">
                                Manage Users
                            </div>
                            <div className="text-xs text-gray-500">
                                Roles, blocking, and more
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}