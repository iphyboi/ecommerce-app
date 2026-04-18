import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
     type: String,
     required: true,
    },
    products: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        },
    ],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
