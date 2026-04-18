import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User"

export async function POST(req: Request) {
    try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    console.log("LOGIN BODY:", body);

    const user = await User.findOne({ email }) as any
    console.log("USER FOUND:", user);

    if(!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('PASSWORD MATCH:', isMatch);

    if(!isMatch) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401});
    }

    const token = jwt.sign(
        { id: user._id,
             email: user.email, 
            role: user.role,
            },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    console.log("TOKEN GENERATED:", token);
    return NextResponse.json({
         token,
         user: {
            email: user.email,
            role: user.role
         }
        }, { status: 200});
        
} catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error"}, {status: 500});
}
}