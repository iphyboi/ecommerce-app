"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface User {
  role: string;
  email?: string;
}


export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  const addToCart = async (product: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("please login to add item to cart");
      return;
    }

    try {

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product: {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      }),
    });

    if (res.ok) {
      alert("added to cart!");
    } else {
      const errorData = await res.json();
      alert(`Failed: ${errorData.message || "could not add to cart"}`);
    }
  } catch (error) {
    console.error("Cart Error:", error);
    alert("Network error, try again later.");
  }
};

  const fetchProducts = async () => {
    try {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64url = token.split(".")[1];
        const base64 = base64url.replace(/-/g,
          "+").replace(/_/g, "/");
          const jsonpayload = decodeURIComponent(
            atob(base64)
            .split("")
             .map((c) => "%" +
            ("00" +
              c.charCodeAt(0).toString(16)).slice(-2))
                         .join("")
            );
            setUser(JSON.parse(jsonpayload));
          } catch (e) {
            console.error("Failed to decode token:", e);
          }
      }
    fetchProducts();
  }, []);
  const isAdmin = user?.role === "admin";

  const handleDelete = async (id: string) => {

    const token = localStorage.getItem("token");
    if (!token) {
      alert ("Login required");
      return;
    }

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  } else {
    alert("Delete failed.check permissions.");
  }
} catch (error) {
  console.error("Delete Error:", error);
}
  };

  const filteredProducts = products.filter((p) =>
  p.name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="p-6 bg-black min-h-screen text-white">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        
      <h1 className="text-3x1 f0nt-bold mb-6">
        Product Dashboard
        </h1>

        <div className="flex gap-3">
          <Link
          href="/cart"
          className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Cart
          </Link>

          {isAdmin && (
        <Link
        href="/add"
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-center"
        >
          + Add Product
          </Link>
          )}
          </div>
          </div>

          <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-gray-800 text-white placeholder-gray-400 outline-none"
          />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((p) => (
            <div
            key={p._id}
            className="border rounded-lg p-3 shadow-sm bg-white"
             >

              <img
              src={p.image}
              alt={p.name}
              className="w-full h-32 object-cover rounded"
              />

              <div className="p-4">
                <h2 className="font-semibold mt-2 text-sm">
                  {p.name}
                </h2>

                <p className="text-green-600 text-sm">
                  &#8358;
                  {Number(p.price).toLocaleString()
                  }
                </p>

                <div className="flex justify-between mt-4">

                  <Link
                  href={`/product/${p._id}`}
                  className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 text-sm"
                  >
                    View
                  </Link>

                  <button
                  onClick={() => addToCart(p)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded"
                  >
                    Add
                  </button>

                  {isAdmin && (
                    <>
                  <Link
                  href={`/edit/${p._id}`}
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>

                  <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  </>
                  )}
                </div>
              </div>
              </div>
          ))}
        </div>
        </div>
  );
}

      