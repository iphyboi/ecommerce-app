import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: String,
            name: String,
            price: Number,
            image: String,
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);