import { useState } from "react";
import toast from "react-hot-toast";
import { BsGoogle } from "react-icons/bs";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiUser,
    FiArrowRight,
    FiCheckCircle,
    FiAward,
    FiZap,
} from "react-icons/fi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.redirectTo || null;

    function postAuthRedirect(isAdmin) {
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
                    toast.success("Account ready! Welcome aboard.");
                    postAuthRedirect(res.data.isAdmin);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Google sign-up failed");
                });
        },
        onError: (err) => {
            console.log(err);
            toast.error("Google sign-up failed");
        },
    });

    // Password strength
    function passwordStrength(pwd) {
        if (!pwd) return { label: "", color: "", width: 0 };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        const map = [
            { label: "Very Weak", color: "bg-red-500", width: 20 },
            { label: "Weak", color: "bg-orange-500", width: 40 },
            { label: "Fair", color: "bg-yellow-500", width: 60 },
            { label: "Good", color: "bg-blue-500", width: 80 },
            { label: "Strong", color: "bg-green-500", width: 100 },
        ];
        return (
            map[Math.min(score, 5) - 1] || {
                label: "",
                color: "",
                width: 0,
            }
        );
    }

    async function handleRegister() {
        if (!email || !firstName || !lastName || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await api.post("/users/", {
                email,
                password,
                firstName,
                lastName,
            });

            toast.success("Account created! Please sign in.");
            navigate("/signin", {
                state: redirectTo ? { redirectTo } : undefined,
            });
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Registration failed"
            );
        }
        setLoading(false);
    }

    const strength = passwordStrength(password);
    const passwordsMatch =
        confirmPassword && password === confirmPassword;

    const inputBase =
        "w-full h-[52px] pl-12 pr-4 rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/40 lg:placeholder:text-gray-400 text-[15px] focus:border-cyan-300 lg:focus:border-accent focus:ring-2 focus:ring-cyan-300/30 lg:focus:ring-accent/20 focus:outline-none transition-all";

    const inputPassword =
        "w-full h-[52px] pl-12 pr-12 rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/40 lg:placeholder:text-gray-400 text-[15px] focus:border-cyan-300 lg:focus:border-accent focus:ring-2 focus:ring-cyan-300/30 lg:focus:ring-accent/20 focus:outline-none transition-all";

    return (
        <div className="w-full min-h-screen bg-[#0a0f1f] flex items-stretch">
            {/* ================= LEFT: BRANDING PANEL ================= */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d]">
                {/* Decorative blobs */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500 rounded-full blur-[140px]"></div>
                    <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-[100px]"></div>
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
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden p-1.5">
                            <img
                                src="/logo.png"
                                alt="PCFORGE Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <span className="text-white font-bold text-xl">
                            PCFORGE
                        </span>
                    </Link>

                    {/* Middle */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-5">
                                <FiZap
                                    size={12}
                                    className="text-cyan-300"
                                />
                                Join 10,000+ happy customers
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                Start your
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                                    PC journey today
                                </span>
                            </h1>
                            <p className="text-white/70 max-w-md text-base leading-relaxed">
                                Create a free account to unlock exclusive
                                deals, track your orders, and get personalized
                                recommendations.
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="flex flex-col gap-4 max-w-md">
                            {[
                                {
                                    icon: FiCheckCircle,
                                    text: "Track all your orders in one place",
                                },
                                {
                                    icon: FiAward,
                                    text: "Member-only deals and discounts",
                                },
                                {
                                    icon: FiZap,
                                    text: "Faster checkout with saved details",
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

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    500+
                                </div>
                                <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">
                                    Products
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    4.9★
                                </div>
                                <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">
                                    Rating
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    24/7
                                </div>
                                <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">
                                    Support
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 text-white/40 text-xs">
                        <HiOutlineCpuChip size={16} />
                        <span>
                            © {new Date().getFullYear()} PCFORGE. All rights
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
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden p-1.5">
                            <img
                                src="/logo.png"
                                alt="PCFORGE Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <span className="text-white font-bold text-lg">
                            PCFORGE
                        </span>
                    </Link>
                </div>

                {/* Form */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
                    <div className="w-full max-w-[440px]">
                        {/* Card */}
                        <div className="lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:border lg:border-gray-100 lg:p-10 bg-white/5 backdrop-blur-md rounded-3xl p-6 lg:backdrop-blur-none border border-white/10 lg:border-gray-100">
                            {/* Header */}
                            <div className="mb-7">
                                <h2 className="text-2xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2">
                                    Create Account
                                </h2>
                                <p className="text-sm text-white/60 lg:text-gray-500">
                                    Already have an account?{" "}
                                    <Link
                                        to="/signin"
                                        state={
                                            redirectTo
                                                ? { redirectTo }
                                                : undefined
                                        }
                                        className="font-semibold text-cyan-300 lg:text-accent hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            {/* Form fields */}
                            <div className="flex flex-col gap-4">
                                {/* Name row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <FiUser
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Kasun"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="given-name"
                                                className={inputBase}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <FiUser
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Perera"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="family-name"
                                                className={inputBase}
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                            autoComplete="email"
                                            className={inputBase}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Password
                                    </label>
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
                                            autoComplete="new-password"
                                            className={inputPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 hover:text-white lg:hover:text-accent transition-colors"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff size={18} />
                                            ) : (
                                                <FiEye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Strength meter */}
                                    {password && (
                                        <div className="mt-2">
                                            <div className="w-full h-1 bg-white/20 lg:bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${strength.color}`}
                                                    style={{
                                                        width: `${strength.width}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-white/60 lg:text-gray-500 mt-1 inline-block">
                                                Strength: {strength.label}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <FiLock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••••"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                            className={inputPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirm(!showConfirm)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 hover:text-white lg:hover:text-accent transition-colors"
                                        >
                                            {showConfirm ? (
                                                <FiEyeOff size={18} />
                                            ) : (
                                                <FiEye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword &&
                                        !passwordsMatch && (
                                            <span className="text-xs text-red-300 lg:text-red-500 mt-1.5 inline-block">
                                                Passwords do not match
                                            </span>
                                        )}
                                    {passwordsMatch && (
                                        <span className="text-xs text-emerald-300 lg:text-emerald-600 mt-1.5 inline-flex items-center gap-1">
                                            <FiCheckCircle size={12} />
                                            Passwords match
                                        </span>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="group w-full h-[52px] rounded-xl bg-white lg:bg-accent text-accent lg:text-white font-semibold text-[15px] hover:bg-cyan-50 lg:hover:bg-accent-hover transition-all shadow-lg shadow-black/10 lg:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-accent/30 lg:border-white/40 border-t-accent lg:border-t-white rounded-full animate-spin"></span>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
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

                                {/* Terms */}
                                <p className="text-[11px] text-white/50 lg:text-gray-400 text-center leading-relaxed mt-1">
                                    By creating an account you agree to our{" "}
                                    <a
                                        href="#"
                                        className="text-cyan-300 lg:text-accent hover:underline font-medium"
                                    >
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="text-cyan-300 lg:text-accent hover:underline font-medium"
                                    >
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Mobile footer */}
                        <p className="lg:hidden text-center text-xs text-white/40 mt-6">
                            © {new Date().getFullYear()} PCFORGE. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}