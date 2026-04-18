import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        console.log("TOKEN ERROR:", error);
        return null;
    }
}