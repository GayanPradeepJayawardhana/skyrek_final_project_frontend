import { useState } from "react";
import toast from "react-hot-toast";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiSend,
    FiMessageCircle,
    FiUser,
    FiCheckCircle,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import api from "../utils/api";

export default function ContactUsPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {

            e.preventDefault();

            if (!form.name || !form.email || !form.message) {
                toast.error("Please fill in all required fields");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                toast.error("Please enter a valid email address");
                return;
            }

            try {
                setSending(true);

                await api.post("/contact", {
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                    message: form.message,
                });

                setSent(true);
                toast.success("Message sent successfully!");

                setTimeout(() => {
                    setForm({ name: "", email: "", subject: "", message: "" });
                    setSent(false);
                }, 3000);
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to send message"
                );
            } finally {
                setSending(false);
            }
    }

    const contactInfo = [
        {
            icon: FiMapPin,
            title: "Visit Us",
            lines: ["123 Tech Street", "Colombo 03, Sri Lanka"],
            bg: "bg-blue-50",
            text: "text-blue-600",
        },
        {
            icon: FiPhone,
            title: "Call Us",
            lines: ["+94 11 234 5678", "+94 77 123 4567"],
            bg: "bg-emerald-50",
            text: "text-emerald-600",
        },
        {
            icon: FiMail,
            title: "Email Us",
            lines: ["hello@icomputers.lk", "support@icomputers.lk"],
            bg: "bg-violet-50",
            text: "text-violet-600",
        },
        {
            icon: FiClock,
            title: "Working Hours",
            lines: ["Mon - Sat: 9AM - 7PM", "Sunday: Closed"],
            bg: "bg-amber-50",
            text: "text-amber-600",
        },
    ];

    const faqs = [
        {
            q: "How long does delivery take?",
            a: "We deliver within 2-3 business days across Sri Lanka. Colombo orders are usually delivered next day.",
        },
        {
            q: "Do we offer warranty on products?",
            a: "Yes, all products come with manufacturer warranty. We also offer extended warranty options.",
        },
        {
            q: "Can I return a product?",
            a: "Absolutely. We have a 7-day hassle-free return policy for unused products in original packaging.",
        },
        {
            q: "Do you offer custom PC builds?",
            a: "Yes! Contact us for a free consultation and we'll help you build the perfect PC for your needs.",
        },
    ];

    // ---- Shared class strings ----
    const fieldLabel =
        "block text-sm font-semibold text-gray-700 mb-2";

    // Base input: taller (52px), full padding, explicit colors, visible focus
    const inputBase =
        "block w-full h-[52px] px-4 rounded-xl border border-gray-200 bg-white " +
        "text-[15px] leading-[52px] text-gray-900 placeholder:text-gray-400 placeholder:font-normal " +
        "focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none " +
        "transition-colors duration-150";

    // Input with a left icon: reserve 46px on left for the icon
    const inputWithIcon = inputBase.replace("px-4", "pl-[46px] pr-4");

    return (
        <div className="w-full min-h-full bg-primary overflow-x-hidden">
            {/* ================= HERO ================= */}
            <section className="relative w-full bg-gradient-to-br from-[#001a84] via-[#00136a] to-[#0a0f3d] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500 rounded-full blur-[120px]"></div>
                </div>

                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium w-fit mx-auto mb-6">
                        <FiMessageCircle size={14} />
                        We'd love to hear from you
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Get in{" "}
                        <span className="bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                        Have a question about a product, order, or custom build?
                        Our team is here to help you every step of the way.
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-[50px]"
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

            {/* ================= CONTACT INFO CARDS ================= */}
            <section className="w-full py-14">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {contactInfo.map((info, i) => (
                            <div
                                key={i}
                                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <info.icon
                                        className={info.text}
                                        size={22}
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    {info.title}
                                </h3>
                                {info.lines.map((line, j) => (
                                    <p
                                        key={j}
                                        className="text-sm text-gray-500 leading-relaxed"
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FORM + SIDEBAR ================= */}
            <section className="w-full pb-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* ===== FORM (3/5) ===== */}
                        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                            <div className="mb-7">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Send us a Message
                                </h2>
                                <p className="text-gray-500 text-sm mt-1.5">
                                    Fill out the form below and we'll get back
                                    to you within 24 hours.
                                </p>
                            </div>

                            {sent ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                        <FiCheckCircle
                                            className="text-emerald-500"
                                            size={32}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Thank you for reaching out. We'll get
                                        back to you soon.
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-6"
                                    noValidate
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Name */}
                                        <div>
                                            <label
                                                htmlFor="contact-name"
                                                className={fieldLabel}
                                            >
                                                Your Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <FiUser
                                                    size={18}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                                />
                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    autoComplete="name"
                                                    className={inputWithIcon}
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="contact-email"
                                                className={fieldLabel}
                                            >
                                                Your Email{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <FiMail
                                                    size={18}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                                />
                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    autoComplete="email"
                                                    className={inputWithIcon}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label
                                            htmlFor="contact-subject"
                                            className={fieldLabel}
                                        >
                                            Subject
                                        </label>
                                        <input
                                            id="contact-subject"
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className={inputBase}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="contact-message"
                                            className={fieldLabel}
                                        >
                                            Message{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Tell us more about your inquiry..."
                                            className="block w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none transition-colors duration-150"
                                        ></textarea>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="group inline-flex items-center justify-center gap-2 min-w-[200px] h-[52px] px-8 rounded-xl bg-accent text-white text-[15px] font-semibold whitespace-nowrap shadow-lg shadow-accent/20 transition-all hover:bg-[#00136a] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                                        >
                                            {sending ? (
                                                <>
                                                    <span className="w-4 h-4 shrink-0 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiSend
                                                        size={16}
                                                        className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                                                    />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* ===== SIDE INFO (2/5) ===== */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Map card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="w-full h-[220px] bg-gradient-to-br from-accent/10 to-accent/5 relative">
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            backgroundImage:
                                                "radial-gradient(circle at 20% 30%, #001a84 1.5px, transparent 1.5px), radial-gradient(circle at 60% 70%, #001a84 1.5px, transparent 1.5px), radial-gradient(circle at 80% 40%, #001a84 1.5px, transparent 1.5px)",
                                            backgroundSize:
                                                "60px 60px, 80px 80px, 70px 70px",
                                        }}
                                    ></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 animate-pulse">
                                            <FiMapPin
                                                className="text-white"
                                                size={24}
                                            />
                                        </div>
                                        <div className="mt-3 px-4 py-2 bg-white rounded-full shadow-md text-xs font-semibold text-gray-700">
                                            Colombo 03, Sri Lanka
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Our Showroom
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Come visit us to see our products in
                                        person and get expert advice.
                                    </p>
                                </div>
                            </div>

                            {/* Social card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    Follow Us
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Stay updated with our latest deals and
                                    news.
                                </p>
                                <div className="flex gap-3">
                                    <a
                                        href="#"
                                        aria-label="Facebook"
                                        className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all hover:bg-blue-600 hover:text-white hover:-translate-y-0.5"
                                    >
                                        <FaFacebookF size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="Twitter"
                                        className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 transition-all hover:bg-sky-500 hover:text-white hover:-translate-y-0.5"
                                    >
                                        <FaTwitter size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="Instagram"
                                        className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 transition-all hover:bg-pink-600 hover:text-white hover:-translate-y-0.5"
                                    >
                                        <FaInstagram size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="YouTube"
                                        className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600 transition-all hover:bg-red-600 hover:text-white hover:-translate-y-0.5"
                                    >
                                        <FaYoutube size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Urgent help card */}
                            <div className="relative bg-gradient-to-br from-accent to-[#0a0f3d] rounded-2xl p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-[60px]"></div>
                                <div className="relative z-10">
                                    <h3 className="font-semibold text-white mb-1">
                                        Need urgent help?
                                    </h3>
                                    <p className="text-sm text-white/70 mb-4">
                                        Our support team is available 24/7 for
                                        critical issues.
                                    </p>
                                    <a
                                        href="tel:+94112345678"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-accent rounded-lg text-sm font-semibold hover:bg-cyan-50 transition-colors"
                                    >
                                        <FiPhone size={14} />
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FAQ ================= */}
            <section className="w-full pb-20">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wide mb-2">
                            <span className="w-8 h-0.5 bg-accent"></span>
                            FAQ
                            <span className="w-8 h-0.5 bg-accent"></span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                                    <span className="font-semibold text-gray-800 text-sm pr-4">
                                        {faq.q}
                                    </span>
                                    <span className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-open:bg-accent group-open:text-white transition-colors">
                                        <svg
                                            className="w-3.5 h-3.5 group-open:rotate-45 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}