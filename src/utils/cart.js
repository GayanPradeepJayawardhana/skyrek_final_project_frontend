export function getCart() {
    const cartString = localStorage.getItem("cart");

    if (cartString == null) {
        localStorage.setItem("cart", "[]");
        return [];
    }

    try {
        const cart = JSON.parse(cartString);
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

export function addToCart(product, qty) {
    const cart = getCart();

    const existingProductIndex = cart.findIndex(
        (item) => item.product.productId === product.productId
    );

    if (existingProductIndex === -1 && qty > 0) {
        cart.push({
            product: {
                productId: product.productId,
                name: product.name,
                image: product.images[0],
                price: product.price,
                labelledPrice: product.labelledPrice,
            },
            qty: qty,
        });
    }

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].qty += qty;

        if (cart[existingProductIndex].qty < 1) {
            cart.splice(existingProductIndex, 1);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

export function getTotal(cart) {
    let total = 0;

    cart.forEach((item) => {
        total += item.product.price * item.qty;
    });

    return total;
}