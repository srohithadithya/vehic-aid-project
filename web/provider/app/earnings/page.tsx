'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, DollarSign, Wallet, Calendar, Download, MoreHorizontal, Filter } from "lucide-react";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EarningsPage() {
    // Mock Data mimicking mobile app
    const earnings = {
        today: 4500,
        week: 12800,
        month: 54300,
        balance: 3200,
    };

    const recentTransactions = [
        { id: "TXN-001", type: 'Service Payout', desc: 'Towing Service - Honda City', amount: 1500, date: '2025-01-15 10:30 AM', status: 'Completed', method: 'Wallet' },
        { id: "TXN-002", type: 'Service Payout', desc: 'Battery Jumpstart - Swift', amount: 800, date: '2025-01-15 08:15 AM', status: 'Completed', method: 'Cash' },
        { id: "TXN-003", type: 'Withdrawal', desc: 'Weekly Settlement', amount: -6500, date: '2025-01-14 06:00 PM', status: 'Processed', method: 'Bank Transfer' },
        { id: "TXN-004", type: 'Service Payout', desc: 'Flat Tyre - Creta', amount: 500, date: '2025-01-14 02:20 PM', status: 'Completed', method: 'Wallet' },
        { id: "TXN-005", type: 'Bonus', desc: 'Peak Hour Bonus', amount: 200, date: '2025-01-14 02:00 PM', status: 'Completed', method: 'Wallet' },
    ];

    return (
        <div className="min-h-screen bg-background p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Earnings & Finance</h1>
                    <p className="text-muted-foreground mt-1">Manage your revenue, payouts, and financial health.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Wallet className="w-4 h-4" /> Request Payout
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{earnings.balance.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">₹{earnings.today.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">5 jobs completed today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{earnings.week.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{earnings.month.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +8% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="col-span-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>Recent earnings and payouts.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.id}</TableCell>
                                    <TableCell>{tx.desc}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'Withdrawal' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell className="text-muted-foreground">{tx.method}</TableCell>
                                    <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-foreground'
                                        }`}>
                                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                            {tx.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Download receipt</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
