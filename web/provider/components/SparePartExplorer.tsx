'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { clsx } from 'clsx';

interface SparePart {
    name: string;
    price: number;
}

interface Store {
    id: number;
    name: string;
    location_name: string;
    inventory: Record<string, number>;
}

interface SparePartExplorerProps {
    requestId: number;
    onFinalize: (parts: SparePart[]) => void;
}

export default function SparePartExplorer({ requestId, onFinalize }: SparePartExplorerProps) {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [cart, setCart] = useState<SparePart[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            // In real app, pass current lat/lng
            const response = await apiClient.get('/spare-parts/nearby/?lat=12.97&lng=77.59');
            setStores(response.data);
        } catch (error) {
            console.error("Failed to fetch stores", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (name: string, price: number) => {
        setCart([...cart, { name, price }]);
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden">
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Spare Parts Procurement</h3>
                    <p className="text-sm text-gray-500">Source parts from nearby verified stores</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                    <ShoppingCart className="w-4 h-4" />
                    {cart.length} items
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-x dark:divide-white/10">
                {/* Store & Search Section */}
                <div className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search stores or parts..."
                            className="w-full bg-gray-100 dark:bg-white/5 border-0 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Searching for nearby stores...</p>
                        ) : (
                            stores.map(store => (
                                <div
                                    key={store.id}
                                    className={clsx(
                                        "p-4 rounded-2xl border transition-all cursor-pointer",
                                        selectedStore?.id === store.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" : "border-gray-100 dark:border-white/5 hover:border-gray-300"
                                    )}
                                    onClick={() => setSelectedStore(store)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{store.name}</h4>
                                            <p className="text-xs text-gray-500">{store.location_name}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-green-500 uppercase">Available</span>
                                    </div>
                                    
                                    {selectedStore?.id === store.id && (
                                        <div className="mt-4 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2">
                                            {Object.entries(store.inventory).map(([name, price]) => (
                                                <div key={name} className="flex justify-between items-center bg-white dark:bg-black/20 p-2 rounded-lg text-sm">
                                                    <span className="capitalize text-gray-700 dark:text-gray-300">{name.replace(/_/g, ' ')}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-gray-900 dark:text-white">₹{price}</span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); addToCart(name, price); }}
                                                            className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Cart & Summary Section */}
                <div className="p-6 bg-gray-50/50 dark:bg-black/10 flex flex-col">
                    <h4 className="font-black text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Order Summary</h4>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 mb-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-2">
                                <ShoppingCart className="w-12 h-12" />
                                <p className="text-sm font-medium">Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm">
                                    <span className="text-sm font-medium capitalize">{item.name.replace(/_/g, ' ')}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">₹{item.price}</span>
                                        <button onClick={() => removeFromCart(i)} className="text-red-500 hover:text-red-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t dark:border-white/10">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Service Base Charge</span>
                            <span className="font-medium">Calculated upon finalization</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Spare Parts Total</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{total}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black border-t dark:border-white/10 pt-4">
                            <span>Final Estimate</span>
                            <span className="text-blue-600">₹{total} + Service</span>
                        </div>
                        
                        <button
                            disabled={cart.length === 0}
                            onClick={() => onFinalize(cart)}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            Finalize Bill & Request Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
