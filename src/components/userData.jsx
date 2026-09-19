import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FiLogIn, FiUserPlus, FiChevronDown } from "react-icons/fi";

export default function UserData() {
    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("me");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
            api
                .get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    setUser(null);
                });
        }
    }, []);

    function handleSelectChange(e) {
        const value = e.target.value;
        setSelectedOption(value);

        if (value === "settings") {
            navigate("/settings");
        }
        if (value === "my-orders") {
            navigate("/my-orders");
        }
        if (value === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("cart");
            sessionStorage.removeItem("checkoutCart");
            setUser(null);
            navigate("/");
        }

        setSelectedOption("me");
    }

    return (
        <>
            {user == null ? (
                <>
                    {/* ===== DESKTOP BUTTONS ===== */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            to="/signin"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
                        >
                            <FiLogIn
                                size={16}
                                className="group-hover:translate-x-0.5 transition-transform"
                            />
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-accent font-semibold text-sm hover:bg-cyan-50 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <FiUserPlus
                                size={16}
                                className="group-hover:scale-110 transition-transform"
                            />
                            Register
                        </Link>
                    </div>

                    {/* ===== MOBILE BUTTON ===== */}
                    <Link
                        to="/signin"
                        className="h-full lg:hidden flex flex-col justify-center items-center text-accent text-3xl"
                    >
                        <FiLogIn />
                        <span className="text-sm text-accent">Login</span>
                    </Link>
                </>
            ) : (
                <div className="relative group">
                    {/* ===== USER PROFILE DROPDOWN (desktop) ===== */}
                    <div className="hidden lg:flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                        <img
                            src={user.image || "/default-profile.png"}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white/40"
                            alt="Profile"
                            onError={(e) => {
                                e.target.src = "/default-profile.png";
                            }}
                        />
                        <div className="flex flex-col items-start">
                            <span className="text-white text-sm font-semibold leading-tight">
                                {user.firstName}
                            </span>
                            <span className="text-white/60 text-xs leading-tight">
                                {user.isAdmin ? "Admin" : "Customer"}
                            </span>
                        </div>
                        <FiChevronDown
                            size={14}
                            className="text-white/60 group-hover:text-white transition-colors"
                        />
                    </div>

                    {/* Dropdown menu */}
                    <div className="hidden lg:block absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm font-semibold text-gray-800 truncate">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {user.email}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/my-orders")}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => navigate("/settings")}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Settings
                        </button>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("cart");
                                    sessionStorage.removeItem("checkoutCart");
                                    setUser(null);
                                    navigate("/");
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* ===== MOBILE DROPDOWN ===== */}
                    <div className="lg:hidden text-white flex flex-col justify-center items-center gap-1">
                        <img
                            src={user.image || "/default-profile.png"}
                            className="w-6 h-6 rounded-full object-cover border border-accent"
                            alt="Profile"
                            onError={(e) => {
                                e.target.src = "/default-profile.png";
                            }}
                        />
                        <select
                            className="bg-transparent text-xs text-accent text-center cursor-pointer focus:outline-none"
                            value={selectedOption}
                            onChange={handleSelectChange}
                        >
                            <option value="me">{user.firstName}</option>
                            <option value="settings">Settings</option>
                            <option value="my-orders">My Orders</option>
                            <option value="logout">Logout</option>
                        </select>
                    </div>
                </div>
            )}
        </>
    );
}