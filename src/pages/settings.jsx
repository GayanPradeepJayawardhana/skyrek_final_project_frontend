import { useEffect, useState } from "react";
import api from "../utils/api";
import uploadMedia from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    FiUser,
    FiLock,
    FiSave,
    FiUploadCloud,
    FiEye,
    FiEyeOff,
    FiShield,
    FiAlertTriangle,
    FiMail,
    FiLogOut,
    FiChevronRight,
} from "react-icons/fi";

export default function Settings() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("/default-profile.png");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // ========== LOAD USER ==========
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login to access settings");
            navigate("/signin");
            return;
        }

        api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setUser(res.data);
                setFirstName(res.data.firstName || "");
                setLastName(res.data.lastName || "");
                setImagePreview(res.data.image || "/default-profile.png");
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Session expired. Please login again.");
                localStorage.removeItem("token");
                navigate("/signin");
            });
    }, [navigate]);

    // ========== IMAGE PICK ==========
    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }

    // ========== SAVE PROFILE ==========
    async function handleUpdateProfile() {
        if (!firstName.trim()) {
            toast.error("First name is required");
            return;
        }
        if (!lastName.trim()) {
            toast.error("Last name is required");
            return;
        }

        try {
            setSavingProfile(true);
            let imageUrl = user.image;

            if (image != null) {
                toast.loading("Uploading image...", { id: "upload" });
                imageUrl = await uploadMedia(image);
                toast.success("Image uploaded", { id: "upload" });
            }

            const token = localStorage.getItem("token");

            await api.put(
                "/users",
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    image: imageUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Profile updated successfully");
            setUser((prev) => ({
                ...prev,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                image: imageUrl,
            }));
            setImage(null);
            setImagePreview(imageUrl);

            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            console.error(err);
            toast.error(
                err?.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSavingProfile(false);
        }
    }

    function handleResetProfile() {
        if (!user) return;
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setImage(null);
        setImagePreview(user.image || "/default-profile.png");
        toast("Changes discarded", { icon: "↩️" });
    }

    // ========== PASSWORD STRENGTH ==========
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

    // ========== CHANGE PASSWORD ==========
    async function handleChangePassword() {
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
            setSavingPassword(true);
            const token = localStorage.getItem("token");

            await api.post(
                "/users/password",
                { password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Password changed successfully");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            toast.error(
                err?.response?.data?.message || "Failed to change password"
            );
        } finally {
            setSavingPassword(false);
        }
    }

    // ========== LOGOUT ==========
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutCart");
        toast.success("Logged out successfully");
        navigate("/");
    }

    if (loading) {
        return (
            <div className="w-full min-h-full bg-primary flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">
                        Loading settings...
                    </p>
                </div>
            </div>
        );
    }

    const strength = passwordStrength(password);
    const hasProfileChanges =
        firstName.trim() !== (user?.firstName || "") ||
        lastName.trim() !== (user?.lastName || "") ||
        image !== null;

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            {/* ===== HEADER ===== */}
            <div className="w-full bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <FiUser size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                Settings
                            </h1>
                            <p className="text-white/60 text-sm mt-0.5">
                                Manage your profile, security, and account
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-8">
                <div className="flex flex-col gap-6">
                    {/* ===== PROFILE CARD ===== */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                                <FiUser size={20} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-800 text-lg">
                                    Profile Information
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Update your name and profile picture
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-4 flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-[140px] h-[140px] rounded-full object-cover border-4 border-accent-light shadow-md"
                                        onError={(e) => {
                                            e.target.src =
                                                "/default-profile.png";
                                        }}
                                    />
                                    <label
                                        htmlFor="settings-image-upload"
                                        className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent-hover transition-colors"
                                        title="Change profile picture"
                                    >
                                        <FiUploadCloud size={18} />
                                        <input
                                            id="settings-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-semibold text-gray-700">
                                        Profile Picture
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        JPG, PNG · Max 2MB
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="flex-1 flex flex-col gap-5">
                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <FiMail
                                            size={16}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full h-[46px] pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        Email cannot be changed
                                    </span>
                                </div>

                                {/* Names */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">
                                            First Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            placeholder="Enter first name"
                                            className="w-full h-[46px] px-3.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">
                                            Last Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            placeholder="Enter last name"
                                            className="w-full h-[46px] px-3.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-gray-100">
                                    <button
                                        onClick={handleResetProfile}
                                        disabled={
                                            !hasProfileChanges ||
                                            savingProfile
                                        }
                                        className="px-5 h-[44px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={
                                            !hasProfileChanges ||
                                            savingProfile
                                        }
                                        className="px-6 h-[44px] rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                                    >
                                        <FiSave size={16} />
                                        {savingProfile
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== PASSWORD CARD ===== */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                                <FiLock size={20} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-800 text-lg">
                                    Change Password
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Update your password regularly for security
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 max-w-[500px]">
                            {/* New password */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    New Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter new password"
                                        className="w-full h-[46px] px-3.5 pr-11 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
                                    >
                                        {showPassword ? (
                                            <FiEyeOff size={16} />
                                        ) : (
                                            <FiEye size={16} />
                                        )}
                                    </button>
                                </div>

                                {password && (
                                    <div className="mt-1">
                                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${strength.color}`}
                                                style={{
                                                    width: `${strength.width}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 inline-block">
                                            Strength: {strength.label}
                                        </span>
                                    </div>
                                )}

                                <div className="text-xs text-gray-400 mt-1">
                                    Must be 8+ characters with at least one
                                    uppercase letter and one number
                                </div>
                            </div>

                            {/* Confirm */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm New Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showConfirm ? "text" : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm new password"
                                        className="w-full h-[46px] px-3.5 pr-11 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirm(!showConfirm)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
                                    >
                                        {showConfirm ? (
                                            <FiEyeOff size={16} />
                                        ) : (
                                            <FiEye size={16} />
                                        )}
                                    </button>
                                </div>
                                {confirmPassword &&
                                    password !== confirmPassword && (
                                        <span className="text-xs text-red-500 mt-1">
                                            Passwords do not match
                                        </span>
                                    )}
                            </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={savingPassword}
                                    className="px-6 h-[44px] rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                                >
                                    <FiShield size={16} />
                                    {savingPassword
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ===== DANGER ZONE ===== */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-100">
                            <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center">
                                <FiAlertTriangle
                                    size={20}
                                    className="text-red-500"
                                />
                            </div>
                            <div>
                                <h2 className="font-semibold text-red-700">
                                    Account Actions
                                </h2>
                                <p className="text-xs text-red-500">
                                    Logout and session management
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-100">
                            <div>
                                <div className="text-sm font-semibold text-gray-800">
                                    Logout from this device
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    You will need to login again to place
                                    orders
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 h-[42px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2 flex-shrink-0"
                            >
                                <FiLogOut size={14} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}