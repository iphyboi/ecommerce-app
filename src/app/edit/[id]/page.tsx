"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
    const { id } = useParams();
     const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("TOKEN IN FRONTEND:", token);
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (!token || user?.role !== "admin") {
            alert("Access Denied: Admins only");
            router.push("/login");
            return;
        }
        console.log("SENDING TOKEN:", token);
        setLoading(false);
    }, [router]);
    

    useEffect(() => {
        if (loading) return;

        const fetchProduct = async () => {
            try {
            const res = await fetch("/api/products");
            const data = await res.json();

            const product = data.find((p: any) => p._id === id);
            if (product) {
                setName(product.name);
                setPrice(product.price);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
        }
    };
        
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("SUBMIT CLICKED");

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized");
            return;
        }

        const formData = new FormData();
        formData.append("_id", id as string);
        formData.append("name", name);
        formData.append("price", price);

        if (file) {
            formData.append("image", file);
        }

        try {
        const res: Response = await fetch("/api/products", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        const data = await res.json();
        console.log("UPDATE RESPONSE:", data);
        if (!res.ok) {
          alert(data.message || "Update failed");
          return;
        }
          alert("Updated successfully");
        router.push("/");
    } catch (err) {
        console.log("ERROR:", err);
    }
    };

    return (
            <div style={{ padding: "20px" }}>
                <h1>Edit Product</h1>

                <form onSubmit={handleSubmit}>
                    <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    <br /><br />

                    <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value )}
                    />
                    <br /><br />

                    <input
                    type="file"
                    onChange={(e: any) => setFile(e.target.files[0])}
                    />
                    <br /><br />

            <button type="submit">Update Product</button>
        </form>
        </div>
    );
}