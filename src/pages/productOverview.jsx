import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import ProductImageSlideShow from "../components/productImageSlideShow";
import getFormattedPrice from "../utils/price-formatter";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import {
    FiShoppingCart,
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiChevronRight,
    FiPackage,
    FiCheckCircle,
} from "react-icons/fi";

export default function ProductOverview() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (productId == null) {
            navigate("/products");
            return;
        }

        setLoading(true);
        api.get("/products/" + productId)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
                toast.error("Product not found");
                navigate("/products");
            });
    }, [productId, navigate]);

    function handleAddToCart() {
        setAdding(true);
        addToCart(product, qty);
        toast.success(
            qty === 1
                ? "Added to cart"
                : `${qty} items added to cart`
        );
        setTimeout(() => setAdding(false), 500);
    }

    function handleBuyNow() {
        navigate("/checkout", {
            state: [
                {
                    product: {
                        productId: product.productId,
                        name: product.name,
                        image: product.images[0],
                        price: product.price,
                        labelledPrice: product.labelledPrice,
                    },
                    qty: qty,
                },
            ],
        });
    }

    if (loading) {
        return (
            <div className="w-full min-h-full bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const hasDiscount = product.price < product.labelledPrice;
    const discountPercent = hasDiscount
        ? Math.round(
              ((product.labelledPrice - product.price) /
                  product.labelledPrice) *
                  100
          )
        : 0;
    const outOfStock = product.stock === 0;

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
                {/* ===== BREADCRUMB ===== */}
                <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                    <Link
                        to="/"
                        className="hover:text-accent transition-colors"
                    >
                        Home
                    </Link>
                    <FiChevronRight size={12} />
                    <Link
                        to="/products"
                        className="hover:text-accent transition-colors"
                    >
                        Products
                    </Link>
                    <FiChevronRight size={12} />
                    <span className="text-gray-400 truncate max-w-[200px]">
                        {product.name}
                    </span>
                </nav>

                {/* ===== MAIN CARD ===== */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* ===== IMAGE PANEL ===== */}
                        <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                            <ProductImageSlideShow images={product.images} />
                        </div>

                        {/* ===== DETAILS PANEL ===== */}
                        <div className="p-6 lg:p-10 flex flex-col">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                {product.brand && (
                                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide">
                                        {product.brand}
                                    </span>
                                )}
                                {product.category && (
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                                        {product.category}
                                    </span>
                                )}
                                {hasDiscount && (
                                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Product ID */}
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                                SKU: {product.productId}
                            </div>

                            {/* Name */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                                {product.name}
                            </h1>

                            {/* Alt names */}
                            {product.altNames &&
                                product.altNames.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {product.altNames.map(
                                            (altName, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"
                                                >
                                                    {altName}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                            {/* Price block */}
                            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-3xl lg:text-4xl font-bold text-accent">
                                    {getFormattedPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            {getFormattedPrice(
                                                product.labelledPrice
                                            )}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-xs font-bold">
                                            Save{" "}
                                            {getFormattedPrice(
                                                product.labelledPrice -
                                                    product.price
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock status */}
                            <div className="mb-6">
                                {outOfStock ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        Out of Stock
                                    </div>
                                ) : product.stock <= 5 ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        Only {product.stock} left in stock
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                                        <FiCheckCircle size={14} />
                                        In Stock ({product.stock} available)
                                    </div>
                                )}
                            </div>

                            {/* Quantity + Actions */}
                            {!outOfStock && (
                                <div className="flex flex-col gap-4 mt-auto">
                                    {/* Qty selector */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            Quantity:
                                        </span>
                                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    setQty(
                                                        Math.max(1, qty - 1)
                                                    )
                                                }
                                                disabled={qty <= 1}
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg"
                                            >
                                                −
                                            </button>
                                            <span className="w-14 h-10 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                                                {qty}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setQty(
                                                        Math.min(
                                                            product.stock,
                                                            qty + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    qty >= product.stock
                                                }
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            Max: {product.stock}
                                        </span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={adding}
                                            className="flex-1 inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl border-2 border-accent text-accent font-semibold text-sm hover:bg-accent hover:text-white transition-all disabled:opacity-60"
                                        >
                                            <FiShoppingCart size={18} />
                                            {adding
                                                ? "Added!"
                                                : "Add to Cart"}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-1 inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            <FiPackage size={18} />
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {outOfStock && (
                                <div className="mt-auto">
                                    <button
                                        disabled
                                        className="w-full inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl bg-gray-200 text-gray-500 font-semibold text-sm cursor-not-allowed"
                                    >
                                        Currently Unavailable
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== TRUST BAR ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {[
                        {
                            icon: FiTruck,
                            title: "Fast Delivery",
                            desc: "2-3 business days",
                        },
                        {
                            icon: FiShield,
                            title: "Secure Payment",
                            desc: "100% protected",
                        },
                        {
                            icon: FiRefreshCw,
                            title: "Easy Returns",
                            desc: "7-day policy",
                        },
                        {
                            icon: FiCheckCircle,
                            title: "Genuine Products",
                            desc: "Warranty included",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <item.icon
                                    size={18}
                                    className="text-accent"
                                />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800">
                                    {item.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}