"use client";
import { useState, useEffect } from "react";

export default function ProductForm({ initialData}:
    { initialData?: any}) {
    const [name, setName] = useState(initialData?.name || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(initialData?.image || null);

    const isEditing = !! initialData;
    const productId = initialData?._id || "";
    const existingImageUrl = initialData?.image || "";

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setPrice(initialData.price || "");
            setPreview(initialData.image || null);
        }
    }, [initialData]);

    const handleImage = (e: any) => {
        const file = e.target.files?.[0];

        if (file) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string)
        };
        reader.readAsDataURL(file)
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        
         if (image) {
            formData.append("image", image);

            const url = isEditing ? `/api/products/${productId}` : "/api/products";
            const method = isEditing ? "PUT" : "POST";
         
        try {

    const res = await fetch(url, {
        method: method,
        body: formData,
    });

    if (res.ok) {
        alert(`${isEditing ? "Product updated!" : "Product added!"}`);
        window.location.href = "/";
} else {
    alert("something went wrong");
}
} catch (error) {
    console.error("error saving product:", error);
}
    
    
    return (
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />

            <br /><br />

            <input type="file" onChange={handleImage} />
            <br /><br />

            <button type="submit">A{isEditing ?
            "Update product" : "Add product"}
            </button>
        </form>
    );
}
}
};

