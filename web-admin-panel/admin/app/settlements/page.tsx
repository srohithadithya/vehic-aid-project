'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

// Mock Data for Settlements
const INITIAL_SETTLEMENTS = [
    { id: 'SET-101', provider: 'John Doe', amount: 4500.00, status: 'PAID', date: '2025-12-25', method: 'Bank Transfer' },
    { id: 'SET-102', provider: 'Jane Smith', amount: 1200.50, status: 'PENDING', date: '2025-12-26', method: 'UPI' },
    { id: 'SET-103', provider: 'Mike Ross', amount: 8900.00, status: 'PROCESSING', date: '2025-12-26', method: 'Bank Transfer' },
    { id: 'SET-104', provider: 'Rachel Green', amount: 3400.00, status: 'PAID', date: '2025-12-24', method: 'Wallet' },
    { id: 'SET-105', provider: 'Monica Geller', amount: 5600.75, status: 'FAILED', date: '2025-12-23', method: 'Bank Transfer' },
];

export default function SettlementsPage() {
    const [settlements, setSettlements] = useState(INITIAL_SETTLEMENTS);
    const [filter, setFilter] = useState('ALL');

    const filteredData = filter === 'ALL'
        ? settlements
        : settlements.filter(s => s.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AdminSidebar />

            <main className="flex-1 ml-64">
                <AdminHeader />

                <div className="px-8 mt-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Financial Settlements</h1>
                </div>

                <div className="p-8 space-y-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 font-medium">Total Payouts (Dec)</h3>
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">₹23,601.25</p>
                            <p className="text-xs text-green-600 mt-2 font-medium">+12% from last month</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 font-medium">Pending Processing</h3>
                                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">₹10,100.50</p>
                            <p className="text-xs text-yellow-600 mt-2 font-medium">3 requests pending</p>
                        </motion.div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage provider payouts and status</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        className="text-sm border-none focus:ring-0 text-gray-700 bg-transparent pr-8 cursor-pointer"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Status</option>
                                        <option value="PAID">Paid</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="FAILED">Failed</option>
                                    </select>
                                </div>
                                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    <Download className="w-4 h-4" />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredData.map((settlement) => (
                                        <tr key={settlement.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{settlement.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                                                        {settlement.provider.charAt(0)}
                                                    </div>
                                                    {settlement.provider}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">₹{settlement.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{settlement.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{settlement.method}</td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    getStatusColor(settlement.status)
                                                )}>
                                                    {settlement.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredData.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    <p>No transactions found matching your filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
