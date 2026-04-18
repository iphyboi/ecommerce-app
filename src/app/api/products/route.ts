import Product from "@/models/product";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
    try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
} catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Failed to fetch products" },
        { status: 500});
    }
}

export async function POST(req: Request) {
try {
     
    const decoded = verifyToken(req) as any;
    if (!decoded) {
        return NextResponse.json({ message: "Unauthorized"}, { status: 401});
    }

    if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Admins only"}, { status: 403});
    }

    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as  File | null;

    let imageUrl = "";

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const upload = await new Promise((resolve, reject) => {
            cloudinary.uploader
            .upload_stream({ folder: "products" }, 
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(buffer);
    });
    imageUrl = (upload as any).secure_url;
        }

        const product = await Product.create({
            name,
            price,
            image: imageUrl,
        });

        return NextResponse.json(product, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error"},
            { status: 500});
    }
}

export async function DELETE(req: Request) {
    try {

        const decoded = verifyToken(req) as any;
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized"}, { status: 401});
        }

        if (decoded.role !== "admin") {
            return NextResponse.json({ message: "Admins only"}, { status: 403});
        }

  await connectDB();

  const { id } = await req.json();
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted successfully" });
} catch (error: any) {
    return NextResponse.json(
        { message: error.message },
        { status: 401}
    );
}
}

export async function PUT(req: Request) {
    console.log("PUT AUTH HEADER:", req.headers.get("authorization"));
    try {
        const user = verifyToken(req);
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401}
            );
        }

        await connectDB();

        const formData = await req.formData();

        const id = formData.get("_id") as string;
        const name = formData.get("name") as string;
        const price = formData.get("price") as string;
        const file = formData.get("image") as File | null;
        
        let updateData: any = { name, price };

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const upload = await new Promise((resolve, reject) => {
                cloudinary.uploader
                .upload_stream({ folder: "products"}, (error, result) => {
                   if (error) reject(error);
                   else resolve(result);
                })
                .end(buffer);
            });
            updateData.image = (upload as any).secure_url;
        }

        const updated = await Product.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: "after" }
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error"}, { status: 500});
    }
}
