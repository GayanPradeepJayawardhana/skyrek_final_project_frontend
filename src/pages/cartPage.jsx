import { useState } from "react";
import { addToCart, getCart, getTotal } from "../utils/cart";
import getFormattedPrice from "../utils/price-formatter";
import { useNavigate } from "react-router-dom";
import {
    FiShoppingBag,
    FiTrash2,
    FiArrowRight,
    FiPackage,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function CartPage() {
    const [cart, setCart] = useState(getCart());
    const navigate = useNavigate();

    const safeCart = Array.isArray(cart) ? cart : [];

    function requireLogin(nextPath) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to continue");
            navigate("/signin", { state: { redirectTo: nextPath } });
            return false;
        }
        return true;
    }

    function handleCheckout() {
        if (!requireLogin("/checkout")) return;
        navigate("/checkout", { state: safeCart });
    }

    if (safeCart.length === 0) {
        return (
            <div className="w-full min-h-full bg-primary flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                        <FiShoppingBag size={32} className="text-accent" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Your cart is empty
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Add some products to your cart to get started.
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

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {safeCart.reduce((sum, item) => sum + item.qty, 0)} items
                        in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {safeCart.map((cartItem, index) => {
                            const lineTotal =
                                cartItem.product.price * cartItem.qty;

                            return (
                                <div
                                    key={cartItem.product.productId || index}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="w-full sm:w-[140px] h-[140px] bg-gray-50 flex-shrink-0">
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
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">
                                                        {cartItem.product.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => {
                                                            addToCart(
                                                                cartItem.product,
                                                                -cartItem.qty
                                                            );
                                                            setCart(getCart());
                                                        }}
                                                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
                                                        title="Remove"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-baseline gap-2 mt-2">
                                                    <span className="text-accent font-bold">
                                                        {getFormattedPrice(
                                                            cartItem.product.price
                                                        )}
                                                    </span>
                                                    {cartItem.product
                                                        .labelledPrice >
                                                        cartItem.product
                                                            .price && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {getFormattedPrice(
                                                                cartItem.product
                                                                    .labelledPrice
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            addToCart(
                                                                cartItem.product,
                                                                -1
                                                            );
                                                            setCart(getCart());
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
                                                            addToCart(
                                                                cartItem.product,
                                                                1
                                                            );
                                                            setCart(getCart());
                                                        }}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

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

                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">
                                Cart Summary
                            </h2>

                            <div className="flex justify-between items-baseline py-5 border-b border-gray-100">
                                <span className="text-sm font-semibold text-gray-700">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-accent">
                                    {getFormattedPrice(getTotal(safeCart))}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-5 h-[52px] rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                            >
                                <FiPackage size={16} />
                                Proceed to Checkout
                                <FiArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}