import { useState } from "react";
import toast from "react-hot-toast";
import { BsGoogle } from "react-icons/bs";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiTruck,
    FiShield,
    FiCheckCircle,
} from "react-icons/fi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.redirectTo || null;

    function postLoginRedirect(isAdmin) {
        if (isAdmin) {
            navigate("/admin");
            return;
        }
        if (redirectTo) {
            navigate(redirectTo);
        } else {
            navigate("/products");
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (response) => {
            api.post("/users/google-login", {
                accessToken: response.access_token,
            })
                .then((res) => {
                    localStorage.setItem("token", res.data.token);
                    postLoginRedirect(res.data.isAdmin);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Google sign-in failed");
                });
        },
        onError: (err) => {
            console.log(err);
            toast.error("Google sign-in failed");
        },
    });

    async function handleLogin() {
        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/users/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            toast.success("Welcome back!");
            postLoginRedirect(res.data.isAdmin);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        }
        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleLogin();
    }

    return (
        <div className="w-full min-h-screen bg-[#0a0f1f] flex items-stretch">
            {/* ================= LEFT: BRANDING PANEL ================= */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d]">
                {/* Decorative blobs */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500 rounded-full blur-[140px]"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-[100px]"></div>
                </div>

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 w-fit">
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                iC
                            </span>
                        </div>
                        <span className="text-white font-bold text-xl">
                            iComputers
                        </span>
                    </Link>

                    {/* Middle content */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Welcome back
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                Your dream
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                                    PC setup awaits
                                </span>
                            </h1>
                            <p className="text-white/70 max-w-md text-base leading-relaxed">
                                Sign in to access your orders, cart, and
                                personalized recommendations.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="flex flex-col gap-4 max-w-md">
                            {[
                                {
                                    icon: FiTruck,
                                    text: "Fast delivery across Sri Lanka",
                                },
                                {
                                    icon: FiShield,
                                    text: "Secure, encrypted transactions",
                                },
                                {
                                    icon: FiCheckCircle,
                                    text: "Genuine products with warranty",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                                        <item.icon
                                            size={16}
                                            className="text-white"
                                        />
                                    </div>
                                    <span className="text-white/80 text-sm">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 text-white/40 text-xs">
                        <HiOutlineCpuChip size={16} />
                        <span>
                            © {new Date().getFullYear()} iComputers. All rights
                            reserved.
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT: FORM PANEL ================= */}
            <div className="w-full lg:w-1/2 flex flex-col bg-primary relative overflow-hidden">
                {/* Mobile decorative bg */}
                <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] opacity-95"></div>
                <div className="lg:hidden absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[100px]"></div>
                </div>

                {/* Mobile logo header */}
                <div className="lg:hidden relative z-10 px-6 pt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <span className="text-white font-bold">iC</span>
                        </div>
                        <span className="text-white font-bold text-lg">
                            iComputers
                        </span>
                    </Link>
                </div>

                {/* Form */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
                    <div className="w-full max-w-[440px]">
                        {/* Card */}
                        <div className="lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:border lg:border-gray-100 lg:p-10 bg-white/5 backdrop-blur-md rounded-3xl p-6 lg:backdrop-blur-none border border-white/10 lg:border-gray-100">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-sm text-white/60 lg:text-gray-500">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        state={
                                            redirectTo ? { redirectTo } : undefined
                                        }
                                        className="font-semibold text-cyan-300 lg:text-accent hover:underline"
                                    >
                                        Sign up free
                                    </Link>
                                </p>
                            </div>

                            {/* Form fields */}
                            <div className="flex flex-col gap-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FiMail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                            autoComplete="email"
                                            className="w-full h-[52px] pl-12 pr-4 rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/40 lg:placeholder:text-gray-400 text-[15px] focus:border-cyan-300 lg:focus:border-accent focus:ring-2 focus:ring-cyan-300/30 lg:focus:ring-accent/20 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 uppercase tracking-wide">
                                            Password
                                        </label>
                                        <Link
                                            to="/forget-password"
                                            className="text-xs text-cyan-300 lg:text-accent font-medium hover:underline"
                                        >
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <FiLock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••••"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                            autoComplete="current-password"
                                            className="w-full h-[52px] pl-12 pr-12 rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/40 lg:placeholder:text-gray-400 text-[15px] focus:border-cyan-300 lg:focus:border-accent focus:ring-2 focus:ring-cyan-300/30 lg:focus:ring-accent/20 focus:outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 hover:text-white lg:hover:text-accent transition-colors"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff size={18} />
                                            ) : (
                                                <FiEye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="group w-full h-[52px] rounded-xl bg-white lg:bg-accent text-accent lg:text-white font-semibold text-[15px] hover:bg-cyan-50 lg:hover:bg-accent-hover transition-all shadow-lg shadow-black/10 lg:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-accent/30 lg:border-white/40 border-t-accent lg:border-t-white rounded-full animate-spin"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <FiArrowRight
                                                size={16}
                                                className="group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px bg-white/20 lg:bg-gray-200"></div>
                                    <span className="text-xs text-white/50 lg:text-gray-400 uppercase tracking-wider">
                                        or
                                    </span>
                                    <div className="flex-1 h-px bg-white/20 lg:bg-gray-200"></div>
                                </div>

                                {/* Google */}
                                <button
                                    onClick={googleLogin}
                                    className="w-full h-[52px] rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-700 font-medium text-[15px] hover:bg-white/20 lg:hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-3"
                                >
                                    <BsGoogle
                                        size={18}
                                        className="text-white lg:text-[#4285F4]"
                                    />
                                    Continue with Google
                                </button>
                            </div>
                        </div>

                        {/* Mobile footer */}
                        <p className="lg:hidden text-center text-xs text-white/40 mt-6">
                            © {new Date().getFullYear()} iComputers. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}