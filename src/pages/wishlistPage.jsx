import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view your wishlist");
            navigate("/signin", { state: { redirectTo: "/wishlist" } });
            return;
        }

        api.get("/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setWishlist(res.data.products || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load wishlist");
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            {/* ===== HEADER ===== */}
            <div className="w-full bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <FiHeart size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                My Wishlist
                            </h1>
                            <p className="text-white/60 text-sm mt-0.5">
                                {wishlist.length}{" "}
                                {wishlist.length === 1 ? "item" : "items"} saved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10">
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-56 bg-gray-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && wishlist.length === 0 && (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
                            <FiHeart size={32} className="text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                            Save products you love and come back to them later.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                        >
                            <FiShoppingBag size={16} />
                            Browse Products
                        </Link>
                    </div>
                )}

                {!loading && wishlist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}