"use client"

import { useEffect, useState } from "react";

export default function CartPage() {
    const [cart, setCart] = useState<any>({ products: [] });

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try{
        const res = await fetch("/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setCart(data);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
};

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQty = async (productId: string, action: string) => {
        const token = localStorage.getItem("token");

        await fetch("/api/cart", {
            method: "PUT",
            headers: {
                "Contnt-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, action }),
        });
        fetchCart();
    };

    const removeItem = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
        await fetch("/api/cart", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
        });

        fetchCart();
    } catch (error) {
        console.error("Error removing item:", error);
    }
};

const clearCart = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/cart", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    fetchCart();
};

const checkout = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    alert(data.message);

    fetchCart();
};

    const total = cart.products.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-3x1 mb-6 font-bold">My Cart</h1>

            {cart.products.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <div className="space-y-4">
                    {cart.products.map((item: any) => (
                        <div
                        key={item.productId}
                        className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded gap-4"
                        >
                            <div className="flex items-center gap-3">

                                <img
                                src={item.image}
                                className="w-16 h-16 object-cover rounded"
                                />
                                
                                <div>
                                <h2 className="font-semibold">{item.name}</h2>
                                <p>&#8358;{item.price}</p>
                            </div>
                            </div>

                              <div className="flex items-center gap-3">

                                <button
                                onClick={() => updateQty(item.productId, "decrease")}
                                className="bg-gray-600 px-2 py-1 rounded"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                            <button
                            onClick={() => updateQty(item.productId, "increase")}
                            className="bg-red-600 px-2 py-1 rounded"
                            >
                                +
                            </button>

                            <button
                            onClick={() => removeItem(item.productId)}
                            className="bg-red-600 px-2 py-1 rounded"
                            >
                                Remove
                            </button>
                            </div>
                            </div>
                    ))}
                    </div>
            )}

            <h2 className="text-xl mt-6">
                Total: &#8358;{total.toLocaleString()}
            </h2>

            {cart.products.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">

                    <button
                    onClick={clearCart}
                    className="bg-red-700 px-4 py-2 rounded"
                    >
                        Clear Cart
                    </button>

                    <button
                    onClick={checkout}
                    className="bg-green-600 px-4 py-2 rounded"
                    >
                        Checkout
                    </button>
                    </div>
            )}
            </div>
    );
}
                