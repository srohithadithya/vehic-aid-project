'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        full_name: ""
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Assuming a standard registration endpoint. Adjust path as needed for your backend.
            // Often /users/register/ or similar.
            await apiClient.post("/users/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: "ADMIN", // Explicitly requesting admin role? usually requires approval
                full_name: formData.full_name
            });
            // Redirect to login on success
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(
                err.response?.data?.detail || "Registration failed. Please try again."
            );
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-background">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

            <motion.div
                className="w-full max-w-md z-10 p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <form
                    onSubmit={handleSubmit}
                    className="glass p-8 rounded-2xl space-y-6 border border-white/10 shadow-2xl"
                >
                    <div className="text-center space-y-2 flex flex-col items-center">
                        <div className="bg-white/10 p-4 rounded-full mb-2 backdrop-blur-md border border-white/20 shadow-xl">
                            <Image
                                src="/logo.png"
                                alt="Vehic-Aid Logo"
                                width={60}
                                height={60}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            Admin Access
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Request access to the Command Center
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground ml-1">FULL NAME</label>
                            <Input
                                name="full_name"
                                placeholder="John Doe"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                className="bg-background/50 border-white/10 focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground ml-1">USERNAME</label>
                            <Input
                                name="username"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="bg-background/50 border-white/10 focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground ml-1">EMAIL</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-background/50 border-white/10 focus:border-primary/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground ml-1">PASSWORD</label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-background/50 border-white/10 focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground ml-1">CONFIRM</label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="bg-background/50 border-white/10 focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300">
                        Create Account
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Already have credentials? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
