import { useState } from "react";
import toast from "react-hot-toast";
import {
    FiMail,
    FiLock,
    FiKey,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiArrowLeft,
    FiCheckCircle,
    FiShield,
    FiClock,
} from "react-icons/fi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ForgetPasswordPage() {
    const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ============ PASSWORD STRENGTH ============
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

    // ============ STEP 1: SEND OTP ============
    async function sendOTP() {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            await api.post("/users/otp", { email });
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to send OTP. Check your email."
            );
        }
        setLoading(false);
    }

    // ============ STEP 2: VERIFY + RESET ============
    async function verifyOTP() {
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }
        if (!/^\d{6}$/.test(otp)) {
            toast.error("OTP must be 6 digits");
            return;
        }
        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await api.post("/users/verify-otp", {
                email,
                otp,
                password: newPassword,
            });

            toast.success("Password changed successfully!");
            navigate("/signin");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "OTP verification failed"
            );
        }
        setLoading(false);
    }

    // ============ RESEND OTP ============
    async function resendOTP() {
        setLoading(true);
        try {
            await api.post("/users/otp", { email });
            toast.success("New OTP sent");
            setOtp("");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to resend OTP"
            );
        }
        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            if (step === 1) sendOTP();
            else verifyOTP();
        }
    }

    const strength = passwordStrength(newPassword);
    const passwordsMatch =
        confirmPassword && newPassword === confirmPassword;

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
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 w-fit"
                    >
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden p-1.5">
                            <img
                                src="/logo.png"
                                alt="iComputers Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <span className="text-white font-bold text-xl">
                            iComputers
                        </span>
                    </Link>

                    {/* Middle */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-5">
                                <FiShield
                                    size={12}
                                    className="text-cyan-300"
                                />
                                Account Recovery
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                Reset your
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                                    password safely
                                </span>
                            </h1>
                            <p className="text-white/70 max-w-md text-base leading-relaxed">
                                We'll send a one-time code to your email so
                                you can securely set a new password.
                            </p>
                        </div>

                        {/* Steps preview */}
                        <div className="flex flex-col gap-4 max-w-md">
                            <div
                                className={`flex items-center gap-3 transition-opacity ${
                                    step === 1 ? "opacity-100" : "opacity-60"
                                }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                                        step === 1
                                            ? "bg-cyan-300/20 border-cyan-300/40"
                                            : "bg-emerald-400/20 border-emerald-400/40"
                                    }`}
                                >
                                    {step === 1 ? (
                                        <FiMail
                                            size={16}
                                            className="text-cyan-300"
                                        />
                                    ) : (
                                        <FiCheckCircle
                                            size={16}
                                            className="text-emerald-300"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-semibold">
                                        Verify your email
                                    </div>
                                    <div className="text-white/50 text-xs">
                                        Enter the email on your account
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`flex items-center gap-3 transition-opacity ${
                                    step === 2 ? "opacity-100" : "opacity-60"
                                }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                                        step === 2
                                            ? "bg-cyan-300/20 border-cyan-300/40"
                                            : "bg-white/10 border-white/20"
                                    }`}
                                >
                                    <FiKey
                                        size={16}
                                        className={
                                            step === 2
                                                ? "text-cyan-300"
                                                : "text-white"
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-semibold">
                                        Set a new password
                                    </div>
                                    <div className="text-white/50 text-xs">
                                        Use the OTP we email you
                                    </div>
                                </div>
                            </div>
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
                <div className="lg:hidden relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden p-1.5">
                            <img
                                src="/logo.png"
                                alt="iComputers Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                        <span className="text-white font-bold text-lg">
                            iComputers
                        </span>
                    </Link>
                    <Link
                        to="/signin"
                        className="text-xs text-white/70 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                        <FiArrowLeft size={12} />
                        Back
                    </Link>
                </div>
                {/* Form */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
                    <div className="w-full max-w-[440px]">
                        {/* Card */}
                        <div className="lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:border lg:border-gray-100 lg:p-10 bg-white/5 backdrop-blur-md rounded-3xl p-6 lg:backdrop-blur-none border border-white/10 lg:border-gray-100">
                            {/* Stepper (desktop only) */}
                            <div className="hidden lg:flex items-center gap-2 mb-7">
                                <div
                                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                                        step >= 1
                                            ? "bg-accent"
                                            : "bg-gray-200"
                                    }`}
                                ></div>
                                <div
                                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                                        step >= 2
                                            ? "bg-accent"
                                            : "bg-gray-200"
                                    }`}
                                ></div>
                            </div>

                            {/* Back link (desktop) */}
                            <Link
                                to="/signin"
                                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors mb-4"
                            >
                                <FiArrowLeft size={12} />
                                Back to login
                            </Link>

                            {/* ================= STEP 1: EMAIL ================= */}
                            {step === 1 && (
                                <>
                                    <div className="mb-7">
                                        <div className="lg:hidden w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                                            <FiMail
                                                size={22}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2">
                                            Forgot Password?
                                        </h2>
                                        <p className="text-sm text-white/60 lg:text-gray-500">
                                            No worries. Enter your email and
                                            we'll send you a one-time code to
                                            reset it.
                                        </p>
                                    </div>

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
                                                        setEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={handleKeyDown}
                                                    autoComplete="email"
                                                    autoFocus
                                                    className={inputBase}
                                                />
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            onClick={sendOTP}
                                            disabled={loading}
                                            className="group w-full h-[52px] rounded-xl bg-white lg:bg-accent text-accent lg:text-white font-semibold text-[15px] hover:bg-cyan-50 lg:hover:bg-accent-hover transition-all shadow-lg shadow-black/10 lg:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-accent/30 lg:border-white/40 border-t-accent lg:border-t-white rounded-full animate-spin"></span>
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                <>
                                                    Send Reset Code
                                                    <FiArrowRight
                                                        size={16}
                                                        className="group-hover:translate-x-0.5 transition-transform"
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {/* Info box */}
                                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 lg:bg-blue-50 border border-white/10 lg:border-blue-100">
                                            <FiClock
                                                size={16}
                                                className="text-cyan-300 lg:text-blue-500 mt-0.5 flex-shrink-0"
                                            />
                                            <p className="text-xs text-white/70 lg:text-blue-700 leading-relaxed">
                                                The code will be valid for{" "}
                                                <strong>
                                                    10 minutes
                                                </strong>
                                                . Check your spam folder if
                                                you don't see it.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ================= STEP 2: OTP + NEW PASSWORD ================= */}
                            {step === 2 && (
                                <>
                                    <div className="mb-7">
                                        <div className="lg:hidden w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                                            <FiKey
                                                size={22}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2">
                                            Set New Password
                                        </h2>
                                        <p className="text-sm text-white/60 lg:text-gray-500">
                                            We sent a code to{" "}
                                            <span className="font-semibold text-cyan-300 lg:text-accent">
                                                {email}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {/* OTP */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                                6-Digit Code
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(
                                                        e.target.value
                                                            .replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                            .slice(0, 6)
                                                    )
                                                }
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                inputMode="numeric"
                                                maxLength={6}
                                                className="w-full h-[60px] text-center text-2xl lg:text-3xl font-bold tracking-[0.5em] rounded-xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-300 focus:border-cyan-300 lg:focus:border-accent focus:ring-2 focus:ring-cyan-300/30 lg:focus:ring-accent/20 focus:outline-none transition-all"
                                            />
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-white/50 lg:text-gray-400 inline-flex items-center gap-1">
                                                    <FiClock size={11} />
                                                    Expires in 10 minutes
                                                </span>
                                                <button
                                                    onClick={resendOTP}
                                                    disabled={loading}
                                                    className="text-xs text-cyan-300 lg:text-accent font-semibold hover:underline disabled:opacity-50"
                                                >
                                                    Resend code
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                                New Password
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
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={handleKeyDown}
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
                                                        <FiEyeOff
                                                            size={18}
                                                        />
                                                    ) : (
                                                        <FiEye size={18} />
                                                    )}
                                                </button>
                                            </div>

                                            {newPassword && (
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
                                                        Strength:{" "}
                                                        {strength.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/70 lg:text-gray-600 mb-1.5 uppercase tracking-wide">
                                                Confirm New Password
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
                                                    onKeyDown={handleKeyDown}
                                                    autoComplete="new-password"
                                                    className={inputPassword}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirm(
                                                            !showConfirm
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 lg:text-gray-400 hover:text-white lg:hover:text-accent transition-colors"
                                                >
                                                    {showConfirm ? (
                                                        <FiEyeOff
                                                            size={18}
                                                        />
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
                                                    <FiCheckCircle
                                                        size={12}
                                                    />
                                                    Passwords match
                                                </span>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            onClick={verifyOTP}
                                            disabled={loading}
                                            className="group w-full h-[52px] rounded-xl bg-white lg:bg-accent text-accent lg:text-white font-semibold text-[15px] hover:bg-cyan-50 lg:hover:bg-accent-hover transition-all shadow-lg shadow-black/10 lg:shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mt-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-accent/30 lg:border-white/40 border-t-accent lg:border-t-white rounded-full animate-spin"></span>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <FiCheckCircle
                                                        size={16}
                                                    />
                                                    Reset Password
                                                </>
                                            )}
                                        </button>

                                        {/* Back to step 1 */}
                                        <button
                                            onClick={() => {
                                                setStep(1);
                                                setOtp("");
                                                setNewPassword("");
                                                setConfirmPassword("");
                                            }}
                                            disabled={loading}
                                            className="w-full text-center text-xs text-white/60 lg:text-gray-500 hover:text-white lg:hover:text-accent transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            <FiArrowLeft size={12} />
                                            Use a different email
                                        </button>
                                    </div>
                                </>
                            )}
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