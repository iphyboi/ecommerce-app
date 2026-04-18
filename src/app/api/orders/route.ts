import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/cart";
import Order from "@/models/Order"
import { verifyToken } from "@/lib/auth";


export async function POST(req: Request) {
    await connectDB();

    const user = verifyToken(req) as any;
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401});
    }

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart || cart.products.length === 0) {
        return NextResponse.json({ message: "Cart is empty" }, { status: 400});
    }

    const total = cart.products.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
    );

    const order = new Order({
        userId: user.id,
        products: cart.products,
        total,
    });

    await Cart.findOneAndDelete({ userId: user.id });
    return NextResponse.json({
        message: "Order placed successfully",
        order,
    });
}

export async function GET(req: Request) {
    await connectDB();

    const user = verifyToken(req) as any;
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: user.id}).sort({
        createdAt: -1,
    });

    return NextResponse.json(orders);
}