import { useEffect, useState } from 'react';
import apiClient from '../lib/api';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/services/bookings/');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings.');
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Provider</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="p-2 border">{b.service_type}</td>
                <td className="p-2 border">{b.status}</td>
                <td className="p-2 border">{new Date(b.created_at).toLocaleDateString()}</td>
                <td className="p-2 border">{b.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
