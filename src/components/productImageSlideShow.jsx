import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProductImageSlideShow({ images = [] }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!images || images.length === 0) {
        images = ["/default-product-1.png"];
    }

    function prev() {
        setActiveImageIndex(
            (activeImageIndex - 1 + images.length) % images.length
        );
    }

    function next() {
        setActiveImageIndex((activeImageIndex + 1) % images.length);
    }

    return (
        <div className="w-full max-w-[500px]">
            {/* Main image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
                <img
                    src={images[activeImageIndex]}
                    alt={`Product image ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product-1.png";
                    }}
                />

                {/* Nav arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all"
                            aria-label="Previous image"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all"
                            aria-label="Next image"
                        >
                            <FiChevronRight size={20} />
                        </button>

                        {/* Counter */}
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-3 flex-wrap">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                                activeImageIndex === index
                                    ? "border-accent shadow-md scale-105"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "/default-product-1.png";
                                }}
                            />
                            {activeImageIndex === index && (
                                <div className="absolute inset-0 bg-accent/10"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}