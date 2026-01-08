'use client';

import LiveMap from '@/components/LiveMap';
import { AdminHeader } from '@/components/admin-header';
import { AdminSidebar } from '@/components/admin-sidebar';

const MOCK_VEHICLES = [
    { id: '1', location: { lat: 19.0760, lng: 72.8777 }, type: 'TOW', status: 'AVAILABLE' },
    { id: '2', location: { lat: 19.0800, lng: 72.8800 }, type: 'MECHANIC', status: 'BUSY' },
] as any;

export default function MapTestPage() {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AdminSidebar />
            <main className="flex-1 ml-64">
                <AdminHeader />
                <div className="p-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">Live Map Test</h1>
                    <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
                        <LiveMap vehicles={MOCK_VEHICLES} />
                    </div>
                </div>
            </main>
        </div>
    );
}
