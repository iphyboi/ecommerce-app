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
        <div style={{ padding: "20px" }}>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", marginBottom: "10px" }}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", marginBottom: "10px" }}
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
    }
