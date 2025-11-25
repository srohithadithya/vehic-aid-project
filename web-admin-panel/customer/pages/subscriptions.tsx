import { useEffect, useState } from 'react';
import apiClient from '../lib/api';

export default function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchSubs = async () => {
    try {
      const res = await apiClient.get('/users/subscriptions/');
      setSubs(res.data);
    } catch (err) {
      setError('Failed to load subscriptions.');
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">My Subscriptions</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Plan</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id}>
                <td className="p-2 border">{s.plan_name}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">{new Date(s.start_date).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(s.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
