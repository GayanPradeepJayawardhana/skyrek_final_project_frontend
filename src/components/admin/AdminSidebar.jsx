import { NavLink } from "react-router-dom";
import {
    FiShoppingCart,
    FiPackage,
    FiUsers,
    FiGrid,
    FiChevronLeft,
    FiChevronRight,
    FiLogOut,
    FiMail,
    FiStar,
    FiMessageSquare,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../utils/api";

const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/admin", label: "Orders", icon: FiShoppingCart, end: true },
    { to: "/admin/products", label: "Products", icon: FiPackage },
    { to: "/admin/users", label: "Users", icon: FiUsers },
    { to: "/admin/contact-messages", label: "Messages", icon: FiMail },
    { to: "/admin/reviews", label: "Reviews", icon: FiStar },
    { to: "/admin/feedback", label: "Feedback", icon: FiMessageSquare },
];

export default function AdminSidebar({ user, onLogout }) {
    const [collapsed, setCollapsed] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchUnread = () => {
            api
                .get("/contact/unread-count", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) =>
                    setUnreadCount(res.data.unreadCount || 0)
                )
                .catch(() => {});
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside
            className={`h-full bg-white flex flex-col border-r border-gray-100 transition-all duration-300 ${
                collapsed ? "w-[80px]" : "w-[260px]"
            }`}
        >
            {/* ===== LOGO ===== */}
            <div className="w-full h-[80px] flex items-center justify-between px-4 border-b border-gray-100">
                {!collapsed ? (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#0a0f3d] flex items-center justify-center shadow-lg shadow-accent/20 overflow-hidden p-1.5">
                            <img
                                src="/logo.png"
                                alt="iComputers Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-tight">
                                iComputers
                            </span>
                            <span className="text-xs text-gray-400">
                                Admin Panel
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#0a0f3d] flex items-center justify-center mx-auto shadow-lg shadow-accent/20 overflow-hidden p-1.5">
                        <img
                            src="/logo.png"
                            alt="iComputers Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`text-gray-400 hover:text-accent hover:bg-gray-50 rounded-lg w-8 h-8 flex items-center justify-center transition-colors ${
                        collapsed ? "absolute left-[60px]" : ""
                    }`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <FiChevronRight size={16} />
                    ) : (
                        <FiChevronLeft size={16} />
                    )}
                </button>
            </div>

            {/* ===== NAVIGATION ===== */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="flex flex-col gap-1.5 px-3">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group relative ${
                                        isActive
                                            ? "bg-gradient-to-r from-accent to-[#0a0f3d] text-white shadow-lg shadow-accent/25"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-accent"
                                    }`
                                }
                                title={collapsed ? item.label : ""}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="relative flex-shrink-0">
                                            <item.icon
                                                size={20}
                                                className={
                                                    isActive
                                                        ? "text-white"
                                                        : "text-gray-500 group-hover:text-accent"
                                                }
                                            />
                                            {collapsed &&
                                                item.label ===
                                                    "Messages" &&
                                                unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                                                )}
                                        </div>

                                        {!collapsed && (
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        )}

                                        {!collapsed &&
                                            item.label === "Messages" &&
                                            unreadCount > 0 && (
                                                <span
                                                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold leading-tight ${
                                                        isActive
                                                            ? "bg-white text-accent"
                                                            : "bg-red-500 text-white"
                                                    }`}
                                                >
                                                    {unreadCount > 99
                                                        ? "99+"
                                                        : unreadCount}
                                                </span>
                                            )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ===== USER FOOTER ===== */}
            <div className="border-t border-gray-100 p-3">
                <div
                    className={`flex items-center gap-3 mb-3 ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <img
                        src={user?.image || "/default-profile.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-accent/20 flex-shrink-0"
                        onError={(e) => {
                            e.target.src = "/default-profile.png";
                        }}
                    />
                    {!collapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                                {user?.email}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium ${
                        collapsed ? "px-0" : ""
                    }`}
                >
                    <FiLogOut size={16} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}