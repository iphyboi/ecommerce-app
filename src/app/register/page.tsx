"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
const  router = useRouter();
    const handleRegister = async (e: any) => {
        e.preventDefault();

        console.log("Register clicked");
           try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });


        const data = await res.json();

        if (!res.ok) {
            alert(`Error: ${data.message || 'something went wrong'}`);
                return;
        }
                router.push("/login");

        
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to connect to the server.")
    }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2x1 font-bold mb-4 text-center">
                    Register
                </h1>

                <form onSubmit={handleRegister}>
                    <input
                    type="text"
                    placeholder="Email"
                    className="w-full order p-2 mb-3"
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

                    <button className="w-full bg-blue-600 text-white p-2 rounded">
                        Register
                    </button>
                </form>

                <p className="text-center mt-3 text-sm">
                    Already have an account?(" ")
                    <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => router.push("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
