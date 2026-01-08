'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Activity, Battery, User as UserIcon, Wifi, AlertCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function IoTFleetPage() {
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');


    useEffect(() => {
        const fetchFleet = async () => {
            try {
                const res = await apiClient.get('/iot/fleet-status/');
                setDevices(res.data);
            } catch (err) {
                console.error("Fleet fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFleet();
        const interval = setInterval(fetchFleet, 60000);
        return () => clearInterval(interval);
    }, []);

    const filteredDevices = devices.filter(d =>
        d.device_id.toLowerCase().includes(filter.toLowerCase()) ||
        d.user.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">IoT Fleet Monitor</h2>
                    <p className="text-muted-foreground">Real-time health of all deployed hardware modules.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter devices..."
                            className="pl-9 w-64 glass shadow-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 bg-card/50 rounded-2xl animate-pulse" />)
                ) : filteredDevices.map((device) => (
                    <motion.div
                        key={device.device_id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="glass-card hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">
                                    {device.device_id}
                                </CardTitle>
                                <Badge variant={device.is_active ? "default" : "secondary"}>
                                    {device.is_active ? 'ACTIVE' : 'OFFLINE'}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <UserIcon size={14} className="mr-2" />
                                    <span>Assigned to: <span className="text-foreground font-medium">{device.user}</span></span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Battery</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Battery size={16} className={device.battery < 20 ? 'text-destructive' : 'text-emerald-500'} />
                                            <span className="font-bold">{device.battery}%</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Signal</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Wifi size={16} className="text-blue-500" />
                                            <span className="font-bold">Excellent</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground uppercase">
                                    <span>Last Signal</span>
                                    <span>{new Date(device.last_signal).toLocaleTimeString()}</span>
                                </div>

                                {device.battery < 20 && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                                        <AlertCircle size={14} />
                                        <span>Critical: Low power alert</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {!loading && filteredDevices.length === 0 && (
                <div className="text-center py-20">
                    <Activity className="mx-auto text-muted-foreground opacity-20" size={64} />
                    <p className="mt-4 text-muted-foreground">No matching devices found in the fleet.</p>
                </div>
            )}
        </div>
    );
}
