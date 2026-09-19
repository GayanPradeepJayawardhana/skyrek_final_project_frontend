import { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
    FiLock,
    FiEye,
    FiEyeOff,
    FiShield,
    FiAlertTriangle,
    FiTrash2,
} from "react-icons/fi";

export default function AdminSettings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

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
        return map[Math.min(score, 5) - 1] || { label: "", color: "", width: 0 };
    }

    async function handleChangePassword() {
        // Validation
        if (!password) {
            toast.error("New password is required");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter");
            return;
        }
        if (!/[0-9]/.test(password)) {
            toast.error("Password must contain at least one number");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            await api.post(
                "/users/password",
                { password },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Password changed successfully");
            setCurrentPassword("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            toast.error(
                err?.response?.data?.message || "Failed to change password"
            );
        } finally {
            setSaving(false);
        }
    }

    function handleClearLocalData() {
        const confirmed = window.confirm(
            "This will clear your local cart and checkout session. Your account is not affected. Continue?"
        );
        if (!confirmed) return;

        localStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutCart");
        toast.success("Local data cleared");
    }

    const strength = passwordStrength(password);

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in flex flex-col gap-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Admin Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account security and store preferences
                </p>
            </div>

            {/* Password card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FiLock size={18} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">
                            Change Password
                        </h3>
                        <p className="text-xs text-gray-500">
                            Update your account password regularly for security
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 max-w-[500px]">
                    {/* Current password (informational only) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full h-[44px] px-3 pr-10 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
                            >
                                {showCurrent ? (
                                    <FiEyeOff size={16} />
                                ) : (
                                    <FiEye size={16} />
                                )}
                            </button>
                        </div>
                        <span className="text-xs text-gray-400">
                            For security, we verify identity by JWT — leave blank if unsure
                        </span>
                    </div>

                    {/* New password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full h-[44px] px-3 pr-10 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
                            >
                                {showNew ? (
                                    <FiEyeOff size={16} />
                                ) : (
                                    <FiEye size={16} />
                                )}
                            </button>
                        </div>

                        {/* Strength bar */}
                        {password && (
                            <div className="mt-1">
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${strength.color}`}
                                        style={{ width: `${strength.width}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 inline-block">
                                    Strength: {strength.label}
                                </span>
                            </div>
                        )}

                        <div className="text-xs text-gray-400 mt-1">
                            Must be 8+ characters with at least one uppercase
                            letter and one number
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Confirm New Password{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                                className="w-full h-[44px] px-3 pr-10 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
                            >
                                {showConfirm ? (
                                    <FiEyeOff size={16} />
                                ) : (
                                    <FiEye size={16} />
                                )}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <span className="text-xs text-red-500 mt-1">
                                Passwords do not match
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleChangePassword}
                            disabled={saving}
                            className="px-6 h-[44px] rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiShield size={16} />
                            {saving ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Store info card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FiShield size={18} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">
                            Store Information
                        </h3>
                        <p className="text-xs text-gray-500">
                            General store configuration
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Store Name
                        </label>
                        <div className="text-sm font-semibold text-gray-800">
                            PCFORGE
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Currency
                        </label>
                        <div className="text-sm font-semibold text-gray-800">
                            LKR (Sri Lankan Rupee)
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Timezone
                        </label>
                        <div className="text-sm font-semibold text-gray-800">
                            Asia/Colombo (UTC+5:30)
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Order Statuses
                        </label>
                        <div className="text-sm font-semibold text-gray-800">
                            Pending · Processing · Shipped · Delivered
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2">
                    <FiAlertTriangle
                        size={16}
                        className="text-blue-500 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-xs text-blue-700">
                        Store settings are currently configured in code. Contact
                        the developer to change them.
                    </div>
                </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-100">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <FiAlertTriangle size={18} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-700">
                            Danger Zone
                        </h3>
                        <p className="text-xs text-red-500">
                            Irreversible or impactful actions
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-red-100">
                    <div>
                        <div className="text-sm font-semibold text-gray-800">
                            Clear Local Data
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            Removes locally stored cart and checkout session
                            from this browser
                        </div>
                    </div>
                    <button
                        onClick={handleClearLocalData}
                        className="px-4 h-[40px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2 flex-shrink-0"
                    >
                        <FiTrash2 size={14} />
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}