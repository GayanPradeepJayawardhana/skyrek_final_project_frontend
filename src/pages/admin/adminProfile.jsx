import { useEffect, useState } from "react";
import api from "../../utils/api";
import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/loadingScreen";
import { FiSave, FiUploadCloud, FiUser } from "react-icons/fi";

export default function AdminProfile() {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        api
            .get("/users/me", {
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
                toast.error("Failed to load profile");
                setLoading(false);
            });
    }, []);

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB");
            return;
        }

        // Validate type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function handleSave() {
        // Validation
        if (!firstName.trim()) {
            toast.error("First name is required");
            return;
        }
        if (!lastName.trim()) {
            toast.error("Last name is required");
            return;
        }

        try {
            setSaving(true);

            let imageUrl = user.image;

            // Upload new image if selected
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
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Profile updated successfully");

            // Refresh local user state
            setUser((prev) => ({
                ...prev,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                image: imageUrl,
            }));
            setImage(null);
            setImagePreview(imageUrl);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setImage(null);
            setImagePreview(user.image || "/default-profile.png");
            toast("Changes discarded", { icon: "↩️" });
        }
    }

    if (loading) return <LoadingScreen />;

    const hasChanges =
        firstName.trim() !== (user?.firstName || "") ||
        lastName.trim() !== (user?.lastName || "") ||
        image !== null;

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Update your personal information and profile picture
                </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="w-[160px] h-[160px] rounded-full object-cover border-4 border-accent-light shadow-md"
                                onError={(e) => {
                                    e.target.src = "/default-profile.png";
                                }}
                            />
                            <label
                                htmlFor="admin-image-upload"
                                className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent-hover transition-colors"
                                title="Change profile picture"
                            >
                                <FiUploadCloud size={18} />
                                <input
                                    id="admin-image-upload"
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

                    {/* Form section */}
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Read-only fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full h-[44px] px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                                />
                                <span className="text-xs text-gray-400">
                                    Email cannot be changed
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <div className="w-full h-[44px] px-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center gap-2 text-gray-600 text-sm">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                                        <FiUser size={12} /> Admin
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Editable fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    First Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter first name"
                                    className="w-full h-[44px] px-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Last Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter last name"
                                    className="w-full h-[44px] px-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleReset}
                                disabled={!hasChanges || saving}
                                className="px-5 h-[44px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                className="px-6 h-[44px] rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSave size={16} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}