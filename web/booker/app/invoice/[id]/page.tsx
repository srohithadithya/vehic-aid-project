'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Printer, Mail } from 'lucide-react';

export default function InvoicePage({ params }: { params: { id: string } }) {
    const [invoice, setInvoice] = useState<any>(null);

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            }
        } catch (error) {
            console.error('Failed to fetch invoice:', error);
        }
    };

    const downloadPDF = () => {
        window.print();
    };

    if (!invoice) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Invoice</h1>
                <div className="flex gap-2 print:hidden">
                    <Button onClick={downloadPDF} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                    </Button>
                    <Button onClick={() => window.print()} variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            <Card className="p-8">
                {/* Header */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600">VehicAid</h2>
                        <p className="text-sm text-gray-600">Your Trusted Roadside Assistance</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Invoice #</p>
                        <p className="text-xl font-bold">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Date: {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold mb-2">Bill To:</h3>
                        <p className="text-gray-700">{invoice.customer_name}</p>
                        <p className="text-gray-600 text-sm">{invoice.customer_email}</p>
                        <p className="text-gray-600 text-sm">{invoice.customer_phone}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Service Details:</h3>
                        <p className="text-gray-700">Request #{invoice.request_id}</p>
                        <p className="text-gray-600 text-sm">{invoice.service_type}</p>
                        <p className="text-gray-600 text-sm">
                            {new Date(invoice.service_date).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2">
                            <th className="text-left py-2">Description</th>
                            <th className="text-right py-2">Quantity</th>
                            <th className="text-right py-2">Rate</th>
                            <th className="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-3">{invoice.service_type}</td>
                            <td className="text-right">1</td>
                            <td className="text-right">₹{invoice.service_charge}</td>
                            <td className="text-right">₹{invoice.service_charge}</td>
                        </tr>
                        {invoice.additional_charges > 0 && (
                            <tr className="border-b">
                                <td className="py-3">Additional Charges</td>
                                <td className="text-right">1</td>
                                <td className="text-right">₹{invoice.additional_charges}</td>
                                <td className="text-right">₹{invoice.additional_charges}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>₹{invoice.subtotal}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Tax (18%):</span>
                            <span>₹{invoice.tax}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t-2 font-bold text-lg">
                            <span>Total:</span>
                            <span>₹{invoice.total}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mt-8 pt-8 border-t">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2">Payment Method:</h3>
                            <p className="text-gray-700">{invoice.payment_method}</p>
                            <p className="text-gray-600 text-sm">Transaction ID: {invoice.transaction_id}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Payment Status:</h3>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {invoice.payment_status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
                    <p>Thank you for choosing VehicAid!</p>
                    <p className="mt-2">For any queries, contact us at support@vehicaid.com</p>
                </div>
            </Card>
        </div>
    );
}
