"use client";

import { useState } from "react";
import { useRouter} from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        console.log("Login attempt...");

           try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            alert("Login successful");
            router.push("/");
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong.please check your connection.");
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h1 className="text-2x1 font-bold mb-4 text-center">
            Login
            </h1>

            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Email"
                className="w-full border p-2 mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button className="w-full bg-green-600 text-white p-2 rounded">
                    Login
                </button>
                </form>

                <p className="text-center mt-3 text-sm">
                    Don't have an account?(" ")
                    <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => router.push("/register")} 
                    >
                        Register
                    </span>
                </p>
                </div>
                </div>
    );
}

            