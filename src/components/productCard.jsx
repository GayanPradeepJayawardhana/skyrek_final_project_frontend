import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getFormattedPrice from "../utils/price-formatter";
import StarRating from "./StarRating";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { toggleWishlist, getWishlist } from "../utils/wishlist";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [checkingWishlist, setCheckingWishlist] = useState(false);

    const hasDiscount = product.price < product.labelledPrice;
    const discountPercent = hasDiscount
        ? Math.round(
              ((product.labelledPrice - product.price) /
                  product.labelledPrice) *
                  100
          )
        : 0;
    const outOfStock = product.stock === 0;

    const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "/default-product-1.png";

    // Load wishlist status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getWishlist()
            .then((data) => {
                setIsWishlisted(
                    data.productIds?.includes(product.productId) || false
                );
            })
            .catch(() => {});
    }, [product.productId]);

    async function handleWishlistClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to add to wishlist");
            navigate("/signin");
            return;
        }

        if (checkingWishlist) return;
        setCheckingWishlist(true);

        try {
            const res = await toggleWishlist(product.productId);
            setIsWishlisted(res.isWishlisted);
            toast.success(res.message);
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    "Failed to update wishlist"
            );
        } finally {
            setCheckingWishlist(false);
        }
    }

    return (
        <Link
            to={"/overview/" + product.productId}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product-1.png";
                    }}
                />

                {hasDiscount && !outOfStock && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                        {discountPercent}% OFF
                    </span>
                )}

                {/* Wishlist heart */}
                <button
                    onClick={handleWishlistClick}
                    disabled={checkingWishlist}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                        isWishlisted
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white/95 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white"
                    } disabled:opacity-60`}
                    title={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    {isWishlisted ? (
                        <FaHeart size={14} />
                    ) : (
                        <FiHeart size={16} />
                    )}
                </button>

                {product.brand && !hasDiscount && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-semibold uppercase tracking-wide rounded-full shadow-sm">
                        {product.brand}
                    </span>
                )}

                {outOfStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white font-semibold text-sm px-4 py-2 bg-black/70 rounded-lg">
                            Out of Stock
                        </span>
                    </div>
                )}

                {!outOfStock && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <span className="inline-flex items-center gap-1.5 text-white text-xs font-semibold">
                            <FiShoppingBag size={12} />
                            View Details
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                    {product.category || "Product"}
                </div>

                <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
                    {product.name}
                </h3>

                {/* Rating */}
                {product.reviewCount > 0 ? (
                    <div className="mt-2 flex items-center gap-2">
                        <StarRating
                            value={product.avgRating || 0}
                            size={12}
                        />
                        <span className="text-[11px] text-gray-500">
                            {Number(product.avgRating || 0).toFixed(1)} (
                            {product.reviewCount})
                        </span>
                    </div>
                ) : (
                    <div className="mt-2 text-[11px] text-gray-400">
                        No reviews yet
                    </div>
                )}

                <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                    <span className="text-accent font-bold text-base">
                        {getFormattedPrice(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-gray-400 line-through text-xs">
                            {getFormattedPrice(product.labelledPrice)}
                        </span>
                    )}
                </div>

                {!outOfStock && product.stock <= 5 && (
                    <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
                            Only {product.stock} left
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}