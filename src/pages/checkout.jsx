import { useState, useEffect } from "react";
import { getTotal } from "../utils/cart";
import getFormattedPrice from "../utils/price-formatter";
import { useLocation, useNavigate } from "react-router-dom";
import CreateOrder from "../components/createOrder";
import {
    FiShoppingBag,
    FiPackage,
    FiArrowLeft,
    FiShield,
    FiTruck,
} from "react-icons/fi";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cart, setCart] = useState(() => {
        if (
            location.state &&
            Array.isArray(location.state) &&
            location.state.length > 0
        ) {
            return location.state;
        }

        try {
            const stored = sessionStorage.getItem("checkoutCart");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch {
            // ignore
        }

        return [];
    });

    useEffect(() => {
        if (cart.length > 0) {
            sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
        } else {
            sessionStorage.removeItem("checkoutCart");
        }
    }, [cart]);

    // Empty state
    if (cart.length === 0) {
        return (
            <div className="w-full min-h-full bg-primary flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                        <FiShoppingBag size={32} className="text-accent" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Your checkout is empty
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Add some products to your cart before checking out.
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center justify-center gap-2 px-6 h-[48px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                    >
                        <FiShoppingBag size={16} />
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = getTotal(cart);
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/cart")}
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors mb-3"
                    >
                        <FiArrowLeft size={14} />
                        Back to Cart
                    </button>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review your items and confirm your order
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ===== ITEMS LIST ===== */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {cart.map((cartItem, index) => {
                            const lineTotal =
                                cartItem.product.price * cartItem.qty;

                            return (
                                <div
                                    key={
                                        cartItem.product.productId || index
                                    }
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="w-full sm:w-[140px] h-[140px] sm:h-[140px] bg-gray-50 flex-shrink-0">
                                            <img
                                                src={cartItem.product.image}
                                                alt={cartItem.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/default-product-1.png";
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                                                    {cartItem.product.name}
                                                </h3>
                                                <div className="flex items-baseline gap-2 mt-2">
                                                    <span className="text-accent font-bold">
                                                        {getFormattedPrice(
                                                            cartItem.product
                                                                .price
                                                        )}
                                                    </span>
                                                    {cartItem.product
                                                        .labelledPrice >
                                                        cartItem.product
                                                            .price && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {getFormattedPrice(
                                                                cartItem
                                                                    .product
                                                                    .labelledPrice
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Qty */}
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            const newCart = [
                                                                ...cart,
                                                            ];
                                                            const newQty =
                                                                newCart[index]
                                                                    .qty - 1;
                                                            if (newQty > 0) {
                                                                newCart[
                                                                    index
                                                                ].qty =
                                                                    newQty;
                                                                setCart(
                                                                    newCart
                                                                );
                                                            }
                                                        }}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                                                        {cartItem.qty}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const newCart = [
                                                                ...cart,
                                                            ];
                                                            newCart[
                                                                index
                                                            ].qty =
                                                                newCart[index]
                                                                    .qty + 1;
                                                            setCart(newCart);
                                                        }}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Line total */}
                                                <div className="text-right">
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                        Subtotal
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-800">
                                                        {getFormattedPrice(
                                                            lineTotal
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ===== ORDER SUMMARY ===== */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-3 pb-5 border-b border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal (
                                        {cart.reduce(
                                            (sum, item) => sum + item.qty,
                                            0
                                        )}{" "}
                                        items)
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {getFormattedPrice(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>
                                    <span className="font-medium text-emerald-600">
                                        Free
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline py-5">
                                <span className="text-sm font-semibold text-gray-700">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-accent">
                                    {getFormattedPrice(total)}
                                </span>
                            </div>

                            <CreateOrder cart={cart} />

                            {/* Trust badges */}
                            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FiShield
                                        size={14}
                                        className="text-accent"
                                    />
                                    Secure & encrypted checkout
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FiTruck
                                        size={14}
                                        className="text-accent"
                                    />
                                    Free delivery within 2-3 days
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FiPackage
                                        size={14}
                                        className="text-accent"
                                    />
                                    7-day easy return policy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}