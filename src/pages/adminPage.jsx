import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminDashboard from "./admin/adminDashboard";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminProductsPage from "./admin/adminProductPage";
import AdminUsersPage from "./admin/adminUsersPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminProfile from "./admin/adminProfile";
import AdminSettings from "./admin/adminSettings";

export default function AdminPage() {
    const [user, setUser] = useState(null);
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
                    if (res.data.isAdmin) {
                        setUser(res.data);
                    } else {
                        toast.error("You are not authorized to access this page");
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Session expired. Please login again.");
                    navigate("/signin");
                });
        } else {
            toast.error("You are not authorized to access this page");
            navigate("/signin");
        }
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutCart");
        toast.success("Logged out successfully");
        navigate("/");
    }

    if (user == null) {
        return <LoadingScreen />;
    }

    return (
        <div className="w-full h-screen flex bg-primary overflow-hidden">
            <AdminSidebar user={user} onLogout={handleLogout} />

            <div className="flex-1 h-full flex flex-col overflow-hidden">
                {/* Pass user + onLogout so the profile menu works */}
                <AdminHeader user={user} onLogout={handleLogout} />

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Routes>
                        <Route path="/" element={<AdminOrdersPage />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/products" element={<AdminProductsPage />} />
                        <Route path="/users" element={<AdminUsersPage />} />
                        <Route path="/add-product" element={<AdminAddProductForm />} />
                        <Route path="/edit-product" element={<AdminEditProductForm />} />
                        <Route path="/profile" element={<AdminProfile />} />
                        <Route path="/settings" element={<AdminSettings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}