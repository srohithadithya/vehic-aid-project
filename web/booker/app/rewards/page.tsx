'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, Copy, Check, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RewardsPage() {
    const { user } = useAuth();
    const [rewards, setRewards] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await apiClient.get('/services/rewards/');
                setRewards(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, []);

    const copyCode = () => {
        if (rewards?.referral_code) {
            navigator.clipboard.writeText(rewards.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Rewards...</div>;

    const nextTierPoints = 1000; // Example
    const progress = Math.min((rewards?.points || 0) / nextTierPoints * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">VehicAid <span className="text-indigo-600">Rewards</span></h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Earn points for every booking and referral. Redeem for free services and wallet cash.
                    </p>
                </div>

                {/* Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-indigo-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-6 h-6 text-yellow-500" />
                                Your Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Current Balance</p>
                                    <div className="text-5xl font-extrabold text-slate-900">
                                        {rewards?.points || 0} <span className="text-lg font-medium text-slate-400">Pts</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold inline-block mb-2">
                                        {rewards?.tier || 'Bronze'} Member
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Progress to Silver</span>
                                    <span>{rewards?.points || 0} / {nextTierPoints}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12">
                                Redeem Points
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-100 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="w-6 h-6 text-pink-500" />
                                Refer & Earn
                            </CardTitle>
                            <CardDescription>
                                Invite friends and earn 500 points when they join.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex flex-col justify-center h-full pb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-indigo-200 text-center space-y-2">
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Your Referral Code</p>
                                <div className="text-3xl font-mono font-bold tracking-widest text-slate-800">
                                    {rewards?.referral_code || '---'}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={copyCode}>
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Tiers Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Bronze', 'Silver', 'Gold'].map((tier, i) => (
                        <Card key={tier} className={`border-0 shadow-md ${i === 0 ? 'bg-orange-50/50' : i === 1 ? 'bg-slate-100/50' : 'bg-yellow-50/50'}`}>
                            <CardContent className="p-6 text-center space-y-4">
                                <Star className={`w-8 h-8 mx-auto ${i === 0 ? 'text-orange-600' : i === 1 ? 'text-slate-500' : 'text-yellow-600'}`} />
                                <h3 className="font-bold text-lg">{tier}</h3>
                                <p className="text-sm text-slate-500">
                                    {i === 0 ? "Entry level. Accumulate points." :
                                        i === 1 ? "1.5x Multiplier on points." :
                                            "2x Multiplier + Priority Support."}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
