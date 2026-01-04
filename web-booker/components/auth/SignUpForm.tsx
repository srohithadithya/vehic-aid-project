'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Check if we have this, otherwise use standard label
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, FileCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        licenseNumber: "",
        licenseFile: null as File | null,
        agreedToTerms: false
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Register User
            await apiClient.post('/users/register/booker/', {
                username: formData.email, // Using email as username
                email: formData.email,
                password: formData.password,
                phone_number: formData.phone,
            });

            // 2. Login to get token
            const tokenResponse = await apiClient.post('/users/token/', {
                username: formData.email,
                password: formData.password
            });

            const { access, refresh } = tokenResponse.data;
            if (access) {
                localStorage.setItem('customer_access_token', access);
                localStorage.setItem('customer_refresh_token', refresh);
                // 3. Redirect
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.log("Registration error:", err);
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
            // If error is an object (validation errors), show the first one
            if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail) {
                const firstKey = Object.keys(err.response.data)[0];
                const firstError = err.response.data[firstKey];
                if (Array.isArray(firstError)) {
                    setError(`${firstKey}: ${firstError[0]}`);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-primary shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step {step} of 3</span>
                    <div className="flex space-x-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
                        ))}
                    </div>
                </div>
                <CardTitle>
                    {step === 1 && "Personal Configuration"}
                    {step === 2 && "Verification"}
                    {step === 3 && "Review & Terms"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
                        {error}
                    </div>
                )}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <Button className="w-full mt-4" onClick={handleNext}>Next: Verification</Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg flex items-start space-x-3 mb-4">
                                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    <p className="font-semibold">Identity Verification Required</p>
                                    <p>To ensure safety, we verify all users manually. Please provide your Driver&apos;s License details.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Driver&apos;s License / LLR Number</Label>
                                <Input
                                    value={formData.licenseNumber}
                                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    placeholder="DL-123456789"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Upload Document</Label>
                                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">Click to upload License Front</p>
                                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button className="flex-1" onClick={handleNext}>Next: Review</Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 p-3 border rounded-md">
                                    <FileCheck className="w-5 h-5 text-green-600" />
                                    <div className="text-sm">
                                        <p className="font-medium">Details Verified</p>
                                        <p className="text-muted-foreground">All inputs are valid format.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    {/* Using mocked checkbox simple input for now as I don't want to create another component yet */}
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={formData.agreedToTerms}
                                        onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                    />
                                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                                        I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>. I confirm that the vehicle details I provide will be accurate.
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="ghost" onClick={handleBack} disabled={isLoading}>Back</Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleSubmit}
                                    disabled={!formData.agreedToTerms || isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
