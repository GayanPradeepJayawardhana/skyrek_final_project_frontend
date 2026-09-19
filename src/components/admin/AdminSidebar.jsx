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
} from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../utils/api";

const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/admin", label: "Orders", icon: FiShoppingCart, end: true },
    { to: "/admin/products", label: "Products", icon: FiPackage },
    { to: "/admin/users", label: "Users", icon: FiUsers },
    { to: "/admin/contact-messages", label: "Messages", icon: FiMail },
];

export default function AdminSidebar({ user, onLogout }) {
    const [collapsed, setCollapsed] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread message count + poll every 60s
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchUnread = () => {
            api
                .get("/contact/unread-count", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setUnreadCount(res.data.unreadCount || 0))
                .catch(() => {});
        };

        fetchUnread();

        const interval = setInterval(fetchUnread, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <aside
            className={`h-full bg-white flex flex-col shadow-xl border-r border-gray-100 transition-all duration-300 ${
                collapsed ? "w-[80px]" : "w-[260px]"
            }`}
        >
            {/* Logo + collapse toggle */}
            <div className="w-full h-[80px] flex items-center justify-between px-4 border-b border-gray-100">
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg">
                            iC
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-tight">
                                iComputers
                            </span>
                            <span className="text-xs text-gray-400">Admin</span>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg mx-auto">
                        iC
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`text-gray-400 hover:text-accent transition-colors ${
                        collapsed ? "absolute left-[60px]" : ""
                    }`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <FiChevronRight size={18} />
                    ) : (
                        <FiChevronLeft size={18} />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="flex flex-col gap-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 group relative ${
                                        isActive
                                            ? "bg-accent text-white shadow-md shadow-accent/20"
                                            : "text-gray-600 hover:bg-accent-light hover:text-accent"
                                    }`
                                }
                                title={collapsed ? item.label : ""}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="relative flex-shrink-0">
                                            <item.icon
                                                size={20}
                                                className={`${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-gray-500 group-hover:text-accent"
                                                }`}
                                            />
                                            {/* Collapsed badge (dot) */}
                                            {collapsed &&
                                                item.label === "Messages" &&
                                                unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                                                )}
                                        </div>

                                        {!collapsed && (
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Expanded badge */}
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

            {/* User footer */}
            <div className="border-t border-gray-100 p-3">
                <div
                    className={`flex items-center gap-3 ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <img
                        src={user?.image || "/default-profile.png"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-accent-light"
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
                    className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium ${
                        collapsed ? "px-0" : ""
                    }`}
                    title="Logout"
                >
                    <FiLogOut size={16} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}