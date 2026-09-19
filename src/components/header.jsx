import { Link, NavLink, useLocation } from "react-router-dom";
import { CiPhone } from "react-icons/ci";
import { FiShoppingCart, FiPackage, FiHeart } from "react-icons/fi";
import { HiOutlineHome, HiOutlineCube } from "react-icons/hi2";
import UserData from "./userData";

export default function Header() {
    const location = useLocation();

    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    const loggedIn =
        typeof window !== "undefined" && !!localStorage.getItem("token");

    const navItems = [
        { to: "/", label: "Home", icon: HiOutlineHome, end: true },
        { to: "/products", label: "Products", icon: HiOutlineCube },
        { to: "/contact-us", label: "Contact Us", icon: CiPhone },
    ];

    return (
        <>
            {/* ================= DESKTOP HEADER ================= */}
            <header className="relative w-full h-[100px] bg-gradient-to-r from-[#001a84] via-[#00136a] to-[#0a0f3d] flex justify-between items-center px-6 lg:px-8 shadow-lg shadow-accent/20 z-40">
                {/* ===== LEFT: LOGO ===== */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group flex-shrink-0"
                >
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all overflow-hidden p-1.5">
                        <img
                            src="/logo.png"
                            alt="iComputers Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>
                    <span className="hidden lg:block text-white font-bold text-xl tracking-tight">
                        iComputers
                    </span>
                </Link>

                {/* ===== CENTER: NAV ===== */}
                <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `group relative inline-flex items-center gap-2 px-4 h-[44px] rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-white text-accent shadow-lg shadow-black/10"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-accent"
                                                : "text-white/70 group-hover:text-white"
                                        }
                                    />
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* ===== RIGHT: WISHLIST + ORDERS + CART + USER ===== */}
                <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                    {loggedIn && (
                        <NavLink
                            to="/wishlist"
                            className={({ isActive }) =>
                                `group inline-flex items-center gap-2 px-4 h-[44px] rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-white text-accent shadow-lg shadow-black/10"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                }`
                            }
                            title="Wishlist"
                        >
                            {({ isActive }) => (
                                <>
                                    <FiHeart
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-accent"
                                                : "text-white/70 group-hover:text-white"
                                        }
                                    />
                                    <span>Wishlist</span>
                                </>
                            )}
                        </NavLink>
                    )}

                    {loggedIn && (
                        <NavLink
                            to="/my-orders"
                            className={({ isActive }) =>
                                `group inline-flex items-center gap-2 px-4 h-[44px] rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-white text-accent shadow-lg shadow-black/10"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                }`
                            }
                            title="My Orders"
                        >
                            {({ isActive }) => (
                                <>
                                    <FiPackage
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-accent"
                                                : "text-white/70 group-hover:text-white"
                                        }
                                    />
                                    <span>My Orders</span>
                                </>
                            )}
                        </NavLink>
                    )}

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `group inline-flex items-center gap-2 px-4 h-[44px] rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? "bg-white text-accent shadow-lg shadow-black/10"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`
                        }
                        title="Cart"
                    >
                        {({ isActive }) => (
                            <>
                                <FiShoppingCart
                                    size={18}
                                    className={
                                        isActive
                                            ? "text-accent"
                                            : "text-white/70 group-hover:text-white"
                                    }
                                />
                                <span>Cart</span>
                            </>
                        )}
                    </NavLink>

                    <UserData />
                </div>
            </header>

            {/* ================= MOBILE BOTTOM NAV ================= */}
            <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white shadow-2xl border-t border-gray-100 flex lg:hidden justify-evenly items-center z-50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex-1 h-full flex flex-col justify-center items-center gap-1 transition-colors ${
                                isActive ? "text-accent" : "text-gray-400"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        isActive ? "bg-accent/10" : ""
                                    }`}
                                >
                                    <item.icon size={22} />
                                </div>
                                <span className="text-[11px] font-semibold">
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}

                {loggedIn && (
                    <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                            `flex-1 h-full flex flex-col justify-center items-center gap-1 transition-colors ${
                                isActive ? "text-accent" : "text-gray-400"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        isActive ? "bg-accent/10" : ""
                                    }`}
                                >
                                    <FiHeart size={22} />
                                </div>
                                <span className="text-[11px] font-semibold">
                                    Wishlist
                                </span>
                            </>
                        )}
                    </NavLink>
                )}

                <UserData />
            </div>
        </>
    );
}