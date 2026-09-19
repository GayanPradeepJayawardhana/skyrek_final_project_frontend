import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import getFormattedPrice from "../utils/price-formatter";
import {
    FiArrowRight,
    FiTruck,
    FiShield,
    FiHeadphones,
    FiRefreshCw,
    FiStar,
    FiChevronRight,
} from "react-icons/fi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { LuMonitor, LuKeyboard, LuMouse, LuHardDrive } from "react-icons/lu";

export default function LandingPage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products")
            .then((res) => {
                // Take first 4 products as featured
                setFeaturedProducts(res.data.slice(0, 4));
                setLoading(false);
            })
            .catch(() => {
                setFeaturedProducts([]);
                setLoading(false);
            });
    }, []);

    const categories = [
        {
            name: "Graphics Cards",
            icon: HiOutlineCpuChip,
            value: "graphic card",
            color: "from-violet-500 to-purple-600",
            bg: "bg-violet-50",
            text: "text-violet-600",
        },
        {
            name: "Processors",
            icon: LuMonitor,
            value: "cpu",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            name: "Memory & Storage",
            icon: LuHardDrive,
            value: "storage",
            color: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
        },
        {
            name: "Keyboards",
            icon: LuKeyboard,
            value: "keyboards",
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50",
            text: "text-amber-600",
        },
        {
            name: "Mice",
            icon: LuMouse,
            value: "mouse",
            color: "from-rose-500 to-rose-600",
            bg: "bg-rose-50",
            text: "text-rose-600",
        },
        {
            name: "Laptops",
            icon: LuMonitor,
            value: "laptops",
            color: "from-cyan-500 to-cyan-600",
            bg: "bg-cyan-50",
            text: "text-cyan-600",
        },
    ];

    const features = [
        {
            icon: FiTruck,
            title: "Fast Delivery",
            description: "Get your order within 2-3 business days",
        },
        {
            icon: FiShield,
            title: "Secure Payment",
            description: "100% secure and encrypted transactions",
        },
        {
            icon: FiRefreshCw,
            title: "Easy Returns",
            description: "7-day hassle-free return policy",
        },
        {
            icon: FiHeadphones,
            title: "24/7 Support",
            description: "Our team is always here to help",
        },
    ];

    return (
        <div className="w-full overflow-x-hidden">
            {/* ================= HERO SECTION ================= */}
            <section className="relative w-full min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500 rounded-full blur-[140px]"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-[100px]"></div>
                </div>

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
                    {/* Left content */}
                    <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium w-fit mx-auto lg:mx-0 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            New arrivals every week
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Build Your
                            <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                                Dream PC Setup
                            </span>
                        </h1>

                        <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                            Premium computer components, peripherals, and
                            accessories — all in one place. Trusted by
                            enthusiasts and professionals alike.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/products"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#001a84] font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                Shop Now
                                <FiArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                            <Link
                                to="/contact-us"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold text-white">
                                    500+
                                </div>
                                <div className="text-xs text-white/60 mt-1 uppercase tracking-wide">
                                    Products
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold text-white">
                                    10K+
                                </div>
                                <div className="text-xs text-white/60 mt-1 uppercase tracking-wide">
                                    Customers
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold text-white">
                                    4.9★
                                </div>
                                <div className="text-xs text-white/60 mt-1 uppercase tracking-wide">
                                    Rating
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-violet-500/30 rounded-3xl blur-3xl"></div>

                            {/* Main card */}
                            <div className="relative w-full h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                                <img
                                    src="/hero-pc.png"
                                    alt="Gaming PC Setup"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to a gradient if image not found
                                        e.target.style.display = "none";
                                    }}
                                />

                                {/* Fallback content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-8 text-center">
                                    <HiOutlineCpuChip size={80} className="mb-4 opacity-50" />
                                    <p className="text-sm">Premium Components</p>
                                </div>
                            </div>

                            {/* Floating badge 1 */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-fade-in">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <FiShield className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Genuine
                                    </div>
                                    <div className="text-sm font-bold text-gray-800">
                                        Products
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge 2 */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <FiStar className="text-amber-500" size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Top Rated
                                    </div>
                                    <div className="text-sm font-bold text-gray-800">
                                        Store
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-[60px]"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.94,137.42,119.56,199.1,101.2Z"
                            fill="#f4f4f4"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* ================= FEATURES BAR ================= */}
            <section className="w-full bg-primary py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <feature.icon
                                        className="text-accent"
                                        size={22}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CATEGORIES SECTION ================= */}
            <section className="w-full bg-primary py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wide mb-2">
                                <span className="w-8 h-0.5 bg-accent"></span>
                                Browse
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Shop by Category
                            </h2>
                            <p className="text-gray-500 mt-2 max-w-lg">
                                Find exactly what you need from our curated
                                collection
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
                        >
                            View All
                            <FiChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Category grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, i) => (
                            <Link
                                key={i}
                                to="/products"
                                className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <category.icon
                                        className={category.text}
                                        size={26}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-accent transition-colors">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FEATURED PRODUCTS ================= */}
            <section className="w-full bg-primary pb-16 lg:pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wide mb-2">
                                <span className="w-8 h-0.5 bg-accent"></span>
                                Handpicked
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Featured Products
                            </h2>
                            <p className="text-gray-500 mt-2 max-w-lg">
                                Top picks from our latest collection
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
                        >
                            View All Products
                            <FiChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Products grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                                >
                                    <div className="w-full h-52 bg-gray-200"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.productId}
                                    to={"/overview/" + product.productId}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src =
                                                    "/default-product-1.png";
                                            }}
                                        />
                                        {product.price <
                                            product.labelledPrice && (
                                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                                {Math.round(
                                                    ((product.labelledPrice -
                                                        product.price) /
                                                        product.labelledPrice) *
                                                        100
                                                )}
                                                % OFF
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm px-4 py-2 bg-black/60 rounded-lg">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                                            {product.brand || product.category}
                                        </div>
                                        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-baseline gap-2 mt-3">
                                            {product.price <
                                                product.labelledPrice && (
                                                <span className="text-gray-400 line-through text-xs">
                                                    {getFormattedPrice(
                                                        product.labelledPrice
                                                    )}
                                                </span>
                                            )}
                                            <span className="text-accent font-bold text-base">
                                                {getFormattedPrice(
                                                    product.price
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100">
                            <HiOutlineCpuChip
                                size={48}
                                className="text-gray-300 mb-4"
                            />
                            <p className="text-gray-500">
                                No products available yet.
                            </p>
                            <Link
                                to="/products"
                                className="mt-4 text-accent font-semibold text-sm hover:underline"
                            >
                                Browse all products
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CTA BANNER ================= */}
            <section className="w-full bg-primary pb-16 lg:pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#001a84] to-[#0a0f3d] overflow-hidden p-8 lg:p-14">
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-[100px]"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="text-center lg:text-left">
                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                    Ready to upgrade your setup?
                                </h3>
                                <p className="text-white/70 max-w-xl">
                                    Browse our full collection of premium
                                    computer components and accessories.
                                </p>
                            </div>
                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#001a84] font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-xl whitespace-nowrap"
                            >
                                Explore Products
                                <FiArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="w-full bg-[#0a0f1f] text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-lg">
                                    iC
                                </div>
                                <span className="text-lg font-bold">
                                    iComputers
                                </span>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed mb-5">
                                Your trusted partner for premium computer
                                components and accessories in Sri Lanka.
                            </p>
                            <div className="flex gap-3">
                                {["F", "T", "I", "Y"].map((s, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-accent flex items-center justify-center text-xs font-bold transition-colors"
                                    >
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Shop */}
                        <div>
                            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wide">
                                Shop
                            </h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                {[
                                    "Graphics Cards",
                                    "Processors",
                                    "Memory",
                                    "Peripherals",
                                    "Laptops",
                                ].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to="/products"
                                            className="hover:text-white transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wide">
                                Support
                            </h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                {[
                                    "Contact Us",
                                    "My Orders",
                                    "Shipping Info",
                                    "Returns",
                                    "FAQ",
                                ].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to="/contact-us"
                                            className="hover:text-white transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wide">
                                Get in Touch
                            </h4>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li>Colombo, Sri Lanka</li>
                                <li>+94 11 234 5678</li>
                                <li>hello@icomputers.lk</li>
                                <li>Mon - Sat: 9AM - 7PM</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/40">
                            © {new Date().getFullYear()} iComputers. All rights
                            reserved.
                        </p>
                        <div className="flex gap-6 text-xs text-white/40">
                            <a href="#" className="hover:text-white">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-white">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}