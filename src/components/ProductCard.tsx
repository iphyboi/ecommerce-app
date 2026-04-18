"use client";

type props = {
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
    };

    onDelete: (id: string) => void;
    onEdit: (product: any) => void;
};

export default function ProductCard({ product, onDelete, onEdit}: props) {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            {product.image && (
            <img src={product.image} width="200" />
            )}

            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            
            <button onClick={() => onDelete(product._id)}>
                Delete
            </button>
            <button onClick={() => onEdit(product)}
            style={{ marginLeft: "10px" }}>
                Edit
            </button>
        </div>
    );
}