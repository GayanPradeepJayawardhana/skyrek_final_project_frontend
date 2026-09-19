import { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/productCard";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiPackage } from "react-icons/fi";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [activeQuery, setActiveQuery] = useState("");

    useEffect(() => {
        if (loading) {
            api.get("/products")
                .then((response) => {
                    setProducts(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    toast.error("Failed to load products");
                    setProducts([]);
                    setLoading(false);
                });
        }
    }, [loading]);

    function searchProducts() {
        if (query.trim() === "") {
            clearSearch();
            return;
        }
        setSearching(true);
        setActiveQuery(query);
        api.get("products/search/" + query)
            .then((response) => {
                setProducts(response.data);
                setSearching(false);
            })
            .catch((error) => {
                console.error("Error searching products:", error);
                toast.error("Search failed");
                setSearching(false);
            });
    }

    function clearSearch() {
        setQuery("");
        setActiveQuery("");
        setLoading(true);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") searchProducts();
    }

    const showSkeletons = loading || searching;

    return (
        <div className="w-full min-h-full bg-primary pb-24 lg:pb-12">
            {/* ===== HERO SEARCH BAR ===== */}
            <div className="w-full bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-12">
                    <div className="text-center mb-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            {products.length} products available
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">
                            Explore Our Products
                        </h1>
                        <p className="text-white/60 text-sm mt-2 max-w-lg mx-auto">
                            Find the perfect components for your next build
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 p-1.5">
                            <FiSearch
                                size={18}
                                className="absolute left-5 text-gray-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="Search products, brands, categories..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 h-[48px] pl-12 pr-3 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors mr-1"
                                    title="Clear"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                            <button
                                onClick={searchProducts}
                                disabled={searching}
                                className="h-[48px] px-6 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 whitespace-nowrap"
                            >
                                {searching ? "Searching..." : "Search"}
                            </button>
                        </div>

                        {/* Active search tag */}
                        {activeQuery && !searching && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="text-xs text-white/60">
                                    Results for:
                                </span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
                                    "{activeQuery}"
                                    <button
                                        onClick={clearSearch}
                                        className="hover:text-red-300"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-[40px]"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.94,137.42,119.56,199.1,101.2Z"
                            fill="#f4f4f4"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* ===== PRODUCTS GRID ===== */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10">
                {showSkeletons && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-56 bg-gray-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!showSkeletons && products.length === 0 && (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                            <FiPackage size={32} className="text-accent" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            {activeQuery
                                ? "No products found"
                                : "No products yet"}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                            {activeQuery
                                ? `We couldn't find anything matching "${activeQuery}". Try a different search term.`
                                : "Our catalog is empty right now. Check back soon!"}
                        </p>
                        {activeQuery && (
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                            >
                                <FiX size={16} />
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {!showSkeletons && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
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