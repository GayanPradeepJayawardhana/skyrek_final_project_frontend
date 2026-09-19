import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/test";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPasswordPage from "./pages/forgetPassword";
import RouteGuard from "./components/RouteGuard";

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="w-full h-screen">
                <Toaster position="top-right" />
                <Routes>
                    {/* ================= ADMIN ROUTES ================= */}
                    {/* Only admins can enter. Users/guests are redirected. */}
                    <Route
                        path="/admin/*"
                        element={
                            <RouteGuard allow="admin">
                                <AdminPage />
                            </RouteGuard>
                        }
                    />

                    {/* ================= AUTH ROUTES ================= */}
                    {/* Guests only — logged-in users of either role get bounced */}
                    <Route path="/signin" element={<LoginPage />} />
                    <Route path="/signup" element={<RegisterPage />} />
                    <Route
                        path="/forget-password"
                        element={<ForgetPasswordPage />}
                    />

                    {/* ================= TEST ================= */}
                    <Route path="/test" element={<TestPage />} />

                    {/* ================= PUBLIC/CUSTOMER ROUTES ================= */}
                    {/* Admins are bounced to /admin */}
                    <Route
                        path="/*"
                        element={
                            <RouteGuard allow="guest-or-user">
                                <HomePage />
                            </RouteGuard>
                        }
                    />
                </Routes>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;