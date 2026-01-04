'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Check, X } from 'lucide-react';
import { apiClient } from '@/lib/api';

// Interface for Job
interface Job {
    id: number;
    service_type: string;
    status: string;
    created_at: string;
    // Add other fields as per ServiceRequestSerializer
}

export default function JobBoard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const response = await apiClient.get('/services/provider/jobs/');
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        // Poll for new jobs every 10 seconds
        const interval = setInterval(fetchJobs, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (id: number) => {
        try {
            await apiClient.post(`/services/provider/jobs/${id}/accept/`);
            setJobs(jobs.filter(j => j.id !== id));
            alert("Job Accepted! Redirecting to navigation...");
        } catch (error) {
            alert("Failed to accept job. It may be taken.");
            fetchJobs();
        }
    };

    const handleReject = (id: number) => {
        setJobs(jobs.filter(j => j.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <header className="flex justify-between items-center mb-6 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-400">Online</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Total Earnings</p>
                    <p className="font-bold text-xl">₹2,450</p>
                </div>
            </header>

            <h1 className="text-2xl font-bold mb-6">Available Jobs ({jobs.length})</h1>

            <div className="space-y-4">
                <AnimatePresence>
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                HIGH PRIORITY
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{job.service_type}</h2>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                        <Clock size={14} /> {new Date(job.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="bg-gray-700 px-3 py-1 rounded-lg">
                                    <span className="font-bold text-green-400">Est. ₹500</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleReject(job.id)}
                                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-lg font-medium transition"
                                >
                                    Ignore
                                </button>
                                <button
                                    onClick={() => handleAccept(job.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"
                                >
                                    Accept <Check size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="text-center py-20 text-gray-500">
                        <div className="animate-spin w-8 h-8 border-4 border-gray-600 border-t-green-500 rounded-full mx-auto mb-4"></div>
                        <p>Loading jobs...</p>
                    </div>
                )}

                {!loading && jobs.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No active requests nearby.</p>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-4 flex justify-around text-gray-400">
                <button className="text-green-500 flex flex-col items-center gap-1">
                    <Navigation size={20} />
                    <span className="text-[10px]">Jobs</span>
                </button>
                <button className="hover:text-white flex flex-col items-center gap-1">
                    <Clock size={20} />
                    <span className="text-[10px]">History</span>
                </button>
            </div>
        </div>
    );
}
