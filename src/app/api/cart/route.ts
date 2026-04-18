import { NextResponse } from "next/server";
import Cart from "@/models/cart";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
await connectDB();

const user = verifyToken(req) as any;
if (!user) {
    return NextResponse.json({ message: "Unauthorized"}, { status: 401});
}

const body = await req.json();
const { product } = body;

let cart = await Cart.findOne({ userId: user.id });

if (!cart) {
    cart = new Cart({
        userId: user.id,
        products: [product],
    });
} else {
    const existing = cart.products.find(
        (p: any) => p.productId === product.productId
    );

    if (existing) {
        existing.quantity += 1;
    } else {
      cart.products.push(product);
    }
}

await cart.save();

return NextResponse.json(cart);
}

export async function GET(req: Request) {
    await connectDB();

    const user = verifyToken(req) as any;

    if (!user) {
        return NextResponse.json({ message: "Unauthorizes" }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId: user.id });

    return NextResponse.json(cart || { products: [] });
}

export async function DELETE(req: Request) {
    await connectDB();

    const user = verifyToken(req) as any;

    if (!user) {
        return NextResponse.json({ message: "Unauthorized"}, { status: 401});
    }

    let productId = null;
    try {
    const data = await req.json();
    productId = data.productId;
    } catch {
        productId = null;
    }

    if (!productId) {
        await Cart.findOneAndDelete({ userId: user.id });
        return NextResponse.json({ message: "Cart cleared" });
    }

    const cart = await Cart.findOne({ userId: user.id });

    if (!cart) return NextResponse.json({ message: "Cart not found"});

        cart.products = cart.products.filter(
            (p: any) => p.productId !== productId        
        );
        await cart.save();

        return NextResponse.json(cart);
}

export async function PUT(req: Request) {
    await connectDB;

    const user = verifyToken(req) as any;

    if (!user) {
        return NextResponse.json({ message: "Unauthorized"}, { status: 401});
    }

    const { productId, action } = await req.json();

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
        return NextResponse.json({ message: "Cart not found" });
    }

    const item = cart.products.find(
        (p: any) => p.productId === productId
    );

    if (!item) {
        return NextResponse.json({ message: "Item not found" });
    }

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart.products = cart.products.filter(
                (p: any) => p.productId !== productId
            );
        }
    }

    await cart.save();
    return NextResponse.json(cart);
}
