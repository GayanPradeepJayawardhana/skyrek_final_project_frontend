import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * RouteGuard protects routes based on role.
 *
 * Props:
 *  - allow: "admin" | "user" | "guest-or-user" | "any"
 *  - children: the JSX to render if access is allowed
 */
export default function RouteGuard({ allow = "any", children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    // Decode role from token (payload is base64)
    let isAdmin = false;
    let loggedIn = false;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            isAdmin = payload.isAdmin === true;
            loggedIn = true;
        } catch {
            // Invalid token
            localStorage.removeItem("token");
        }
    }

    useEffect(() => {
        // Admin trying to access user/guest routes
        if (allow === "user" && isAdmin) {
            toast.error("Admins cannot access the customer site");
            navigate("/admin", { replace: true });
            return;
        }

        // User/guest trying to access admin routes
        if (allow === "admin") {
            if (!loggedIn) {
                toast.error("Please login to access the admin panel");
                navigate("/signin", { replace: true });
                return;
            }
            if (!isAdmin) {
                toast.error("You are not authorized to access the admin panel");
                navigate("/", { replace: true });
                return;
            }
        }

        // Admin trying to access public routes (guest-or-user)
        if (allow === "guest-or-user" && isAdmin) {
            toast.error("Admins cannot access the customer site");
            navigate("/admin", { replace: true });
            return;
        }
    }, [allow, isAdmin, loggedIn, navigate, location.pathname]);

    // Block render until the redirect takes effect
    if (allow === "admin" && (!loggedIn || !isAdmin)) return null;
    if (allow === "user" && isAdmin) return null;
    if (allow === "guest-or-user" && isAdmin) return null;

    return children;
}