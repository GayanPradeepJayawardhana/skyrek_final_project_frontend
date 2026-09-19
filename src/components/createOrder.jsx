import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiX, FiMapPin, FiUser, FiPhone, FiHome } from "react-icons/fi";

export default function CreateOrder({ cart }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    // Prefill from logged-in user
    useEffect(() => {
        if (!isModalOpen) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!firstName) setFirstName(res.data.firstName || "");
                if (!lastName) setLastName(res.data.lastName || "");
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    // Lock body scroll when modal open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    async function placeOrder() {
        if (!firstName || !lastName || !addressLine1 || !city || !phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) {
            toast.error("Please enter a valid phone number");
            return;
        }

        try {
            setPlacing(true);

            const body = {
                firstName,
                lastName,
                addressLine1,
                addressLine2,
                city,
                phone,
                items: [],
            };

            for (let i = 0; i < cart.length; i++) {
                const item = cart[i];
                body.items.push({
                    productId: item.product.productId,
                    quantity: item.qty,
                });
            }

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login to place an order");
                navigate("/signin");
                return;
            }

            const response = await api.post("/orders", body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(response.data);
            toast.success("Order placed successfully!");

            // Clear cart
            localStorage.setItem("cart", "[]");
            sessionStorage.removeItem("checkoutCart");

            setIsModalOpen(false);
            navigate("/my-orders");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "An error occurred"
            );
        } finally {
            setPlacing(false);
        }
    }

    const inputClass =
        "w-full h-[48px] pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all";

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-[52px] rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
                <FiHome size={16} />
                Place Order
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => !placing && setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-[560px] bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-br from-accent to-[#0a0f3d] px-6 py-5 text-white">
                            <button
                                onClick={() =>
                                    !placing && setIsModalOpen(false)
                                }
                                disabled={placing}
                                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                                <FiX size={18} />
                            </button>
                            <h2 className="text-xl font-bold">
                                Shipping Details
                            </h2>
                            <p className="text-white/70 text-xs mt-1">
                                Where should we deliver your order?
                            </p>
                        </div>

                        {/* Form */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {/* Names */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                            First Name *
                                        </label>
                                        <div className="relative">
                                            <FiUser
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                            Last Name *
                                        </label>
                                        <div className="relative">
                                            <FiUser
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Address Line 1 *
                                    </label>
                                    <div className="relative">
                                        <FiMapPin
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="123 Main Street"
                                            value={addressLine1}
                                            onChange={(e) =>
                                                setAddressLine1(
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Address Line 2{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <FiMapPin
                                            size={16}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Apartment, suite, etc."
                                            value={addressLine2}
                                            onChange={(e) =>
                                                setAddressLine2(
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* City + Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                            City *
                                        </label>
                                        <div className="relative">
                                            <FiMapPin
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Colombo"
                                                value={city}
                                                onChange={(e) =>
                                                    setCity(e.target.value)
                                                }
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                            Phone *
                                        </label>
                                        <div className="relative">
                                            <FiPhone
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="+94 77 123 4567"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={placing}
                                className="flex-1 h-[48px] rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={placing}
                                onClick={placeOrder}
                                className="flex-1 h-[48px] rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            >
                                {placing ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Placing...
                                    </>
                                ) : (
                                    "Confirm Order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}