import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image:String,
});

export default mongoose.models.Product ||
 mongoose.model("Product", productSchema);