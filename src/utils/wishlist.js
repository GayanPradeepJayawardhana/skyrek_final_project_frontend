import api from "./api";

export async function toggleWishlist(productId) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Login required");

    const res = await api.post(
        `/wishlist/toggle/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function getWishlist() {
    const token = localStorage.getItem("token");
    if (!token) return { products: [], productIds: [] };

    const res = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function getWishlistStatus(productId) {
    const token = localStorage.getItem("token");
    if (!token) return { isWishlisted: false };

    const res = await api.get(`/wishlist/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}