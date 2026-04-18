"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);

    const fetchProduct = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();

        const found = data.find((p: any) => p._id === id);
        setProduct(found);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (!product) return <p style={{ padding: "20px" }}> Loading...</p>;

    return (
        <div style={{
             padding: "20px",
             display: "flex",
             justifyContent: "center"
        }}>
            <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}>

                <img
                src={product.image}
                style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    maxWidth: "700px",
                    margin: "0 auto",
                    display: "block"
                }}
                />

                <h1 style={{ marginTop: "15px" }}>
                    {product.name}
                </h1>

                <p style={{ fontSize: "18px", color: "#333" }}>
                    price:&#8358;{product.price}
                </p>

                <a href="/" style={{
                    display: "inline-block",
                    marginTop: "15px",
                    color: "blue"
                }}>
                    Back to Home
                </a>
            </div>
            </div>
    );
}