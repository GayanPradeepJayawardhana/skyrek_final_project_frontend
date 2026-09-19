import { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
    FiBell,
    FiChevronRight,
    FiChevronDown,
    FiHome,
    FiSearch,
    FiLogOut,
    FiUser,
    FiSettings,
} from "react-icons/fi";

const routeTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin": "Orders",
    "/admin/products": "Products",
    "/admin/users": "Users",
    "/admin/contact-messages": "Contact Messages",
    "/admin/reviews": "Product Reviews",
    "/admin/feedback": "Website Feedback",
    "/admin/add-product": "Add Product",
    "/admin/edit-product": "Edit Product",
    "/admin/profile": "My Profile",
    "/admin/settings": "Admin Settings",
};

export default function AdminHeader({ user, onLogout }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const pageTitle = routeTitles[location.pathname] || "Admin";

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    function handleLogoutClick() {
        setMenuOpen(false);
        onLogout();
    }

    return (
        <header className="w-full h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-6">
            {/* ===== LEFT: BREADCRUMB + TITLE ===== */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-1 hover:text-accent transition-colors"
                    >
                        <FiHome size={12} />
                        Admin
                    </Link>
                    <FiChevronRight size={12} />
                    <span className="text-gray-500">{pageTitle}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800 mt-0.5">
                    {pageTitle}
                </h1>
            </div>

            {/* ===== RIGHT: SEARCH + NOTIFICATIONS + PROFILE ===== */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <div
                    className={`relative transition-all duration-300 ${
                        showSearch ? "w-[260px]" : "w-[40px]"
                    }`}
                >
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-gray-50 rounded-xl transition-colors"
                        title="Search"
                    >
                        <FiSearch size={18} />
                    </button>
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search orders, products, users..."
                            className="w-full h-[42px] pl-12 pr-3 rounded-xl border border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none text-sm transition-all"
                            autoFocus
                        />
                    )}
                </div>

                {/* Notifications */}
                <button
                    className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-gray-50 rounded-xl transition-colors"
                    title="Notifications"
                >
                    <FiBell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <img
                            src={user?.image || "/default-profile.png"}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover border-2 border-accent/20"
                            onError={(e) => {
                                e.target.src = "/default-profile.png";
                            }}
                        />
                        <div className="hidden lg:flex flex-col items-start">
                            <span className="text-sm font-semibold text-gray-800 leading-tight">
                                {user?.firstName}
                            </span>
                            <span className="text-xs text-gray-400 leading-tight">
                                Admin
                            </span>
                        </div>
                        <FiChevronDown
                            size={14}
                            className={`text-gray-400 transition-transform ${
                                menuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-slide-in overflow-hidden">
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="text-sm font-semibold text-gray-800 truncate">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                    {user?.email}
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <Link
                                    to="/admin/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FiUser size={16} />
                                    My Profile
                                </Link>

                                <Link
                                    to="/admin/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FiSettings size={16} />
                                    Admin Settings
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 pt-1">
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                                >
                                    <FiLogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}