"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">

            <Link href="/" className="text-xl font-bold">
            MyStore
            </Link>

            <div className="flex gap-3 text-sm">

                <Link
                href="/"
                className="hover:text-yellow-400"
                >
                    Home
                </Link>

                <Link
                href="/cart"
                className="hover:text-yellow-400"
                >
                    Cart
                </Link>

                <Link
                href="/orders"
                className="hover:text-yellow-400"
                >
                    Orders
                </Link>
            </div>
        </nav>
    );
}
