"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-3x1 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <p>No Orders yet</p>
            ) : (
                <div className="space-y-6">

                    {orders.map((order) => (
                        <div
                        key={order._id}
                        className="bg-gray-800 p-4 rounded"
                        >
                            <p className="mb-2 text-sm text-gray-400">
                                {new Date(order.createdAt).toLocaleString()}
                            </p>

                            {order.products.map((item: any) => (
                                <div key={item.productId} className="flex justify-between">
                                    <span>{item.name}</span>
                                    <span>
                                        {item.quantity} * &#8358;{item.price}
                                    </span>
                                    </div>
                            ))}

                            <h2 className="mt-3 font-bold">
                                Total: &#8358;{order.total.toLocaleString()}
                            </h2>
                            </div>
                    ))}
                    </div>
            )}
        </div>
    );
}