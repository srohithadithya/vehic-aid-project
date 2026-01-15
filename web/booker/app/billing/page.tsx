'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Zap } from 'lucide-react';

export default function BillingPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
            <p className="text-muted-foreground mb-8">Manage your subscription and payment methods.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Current Plan Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>You are currently on the <span className="font-semibold text-foreground">Free Tier</span></CardDescription>
                            </div>
                            <Badge variant="outline" className="text-sm py-1 px-3">Free</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Service Requests</span>
                                <span className="font-medium">Unlimited</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Priority Support</span>
                                <span className="text-muted-foreground">Not Included</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
                                <div className="bg-primary h-full w-3/4"></div>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Usage cycle resets in 12 days</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Upgrade Plan</Button>
                    </CardFooter>
                </Card>

                {/* Payment Method Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Default for all charges</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="w-16 h-10 bg-slate-200 rounded-md flex items-center justify-center mb-4 text-slate-500">
                            <CreditCard />
                        </div>
                        <p className="text-sm font-medium">No card added</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="secondary">Add Payment Method</Button>
                    </CardFooter>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">INV001</td>
                                    <td className="p-4 align-middle"><Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid</Badge></td>
                                    <td className="p-4 align-middle">$35.00</td>
                                    <td className="p-4 align-middle">Jan 12, 2024</td>
                                    <td className="p-4 align-middle text-right"><Button variant="ghost" size="sm">Download</Button></td>
                                </tr>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">INV002</td>
                                    <td className="p-4 align-middle"><Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid</Badge></td>
                                    <td className="p-4 align-middle">$8.50</td>
                                    <td className="p-4 align-middle">Dec 10, 2023</td>
                                    <td className="p-4 align-middle text-right"><Button variant="ghost" size="sm">Download</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
