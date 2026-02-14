'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, FileCheck, ShieldCheck, User, Mail, Lock, Phone, CreditCard, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
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
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Simple password strength calc
        let strength = 0;
        if (formData.password.length > 6) strength += 25;
        if (formData.password.match(/[A-Z]/)) strength += 25;
        if (formData.password.match(/[0-9]/)) strength += 25;
        if (formData.password.match(/[^A-Za-z0-9]/)) strength += 25;
        setPasswordStrength(strength);
    }, [formData.password]);

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
            console.debug("Registration error:", err);
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

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <Card className="border-t-4 border-t-primary shadow-2xl bg-background/60 backdrop-blur-xl max-w-lg w-full mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step {step} of 3</span>
                    <div className="flex space-x-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("h-1.5 w-6 rounded-full transition-colors duration-300", i <= step ? "bg-primary" : "bg-muted")} />
                        ))}
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                    {step === 1 && "Start Your Journey"}
                    {step === 2 && "Verify Identity"}
                    {step === 3 && "Review & Confirm"}
                </CardTitle>
                <CardDescription>
                    {step === 1 && "Create your secure account"}
                    {step === 2 && "Upload your license for verification"}
                    {step === 3 && "Finalize your registration"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="pl-9"
                                    />
                                </div>
                                {formData.password && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Strength</span>
                                            <span>{passwordStrength}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-300",
                                                    passwordStrength < 50 ? "bg-red-500" :
                                                        passwordStrength < 75 ? "bg-yellow-500" : "bg-green-500"
                                                )}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button className="w-full mt-4 group" onClick={handleNext}>
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-4"
                        >
                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-start space-x-3 mb-4">
                                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-foreground">Identity Verification</p>
                                    <p className="text-muted-foreground">We require a valid Driver&apos;s License to ensure platform safety.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Driver&apos;s License / LLR Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={formData.licenseNumber}
                                        onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        placeholder="DL-123456789"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Upload Document</Label>
                                <div className="border-2 border-dashed border-input rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group relative">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setFormData({ ...formData, licenseFile: file });
                                        }}
                                    />
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                                        {formData.licenseFile ? (
                                            <FileCheck className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">
                                        {formData.licenseFile ? formData.licenseFile.name : "Click to upload License Front"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button variant="ghost" onClick={handleBack} className="w-1/3">Back</Button>
                                <Button className="flex-1 group" onClick={handleNext} disabled={!formData.licenseNumber || !formData.licenseFile}>
                                    Next Step
                                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="bg-green-500/20 p-2 rounded-full">
                                        <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Details Ready</p>
                                        <p className="text-muted-foreground">Please review and agree to proceed.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={formData.agreedToTerms}
                                            onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                        />
                                    </div>
                                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed font-normal">
                                        I agree to the <span className="text-primary hover:underline cursor-pointer font-medium">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer font-medium">Privacy Policy</span>. I confirm that all provided details are accurate.
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="ghost" onClick={handleBack} disabled={isLoading} className="w-1/3">Back</Button>
                                <Button
                                    className="flex-1 shadow-lg shadow-primary/20"
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
