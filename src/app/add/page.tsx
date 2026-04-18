"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Add() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must login first");
            router.push("/login")
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        if (file) formData.append("image", file);
           try {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

       if (res.ok) {
        alert("Product added");
        router.push("/")
    } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to add product');
    }
} catch (err) {
    console.error("Fetch error:", err);
    alert("An error occurred");
}
};

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add product</h1>
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button>Add</button>
        </form>
        </div>
    );
}