import { useEffect, useState } from 'react';
import apiClient from '../lib/api';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [form, setForm] = useState({ make: '', model: '', year: '', license_plate: '' });
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await apiClient.get('/users/vehicles/');
      setVehicles(res.data);
    } catch (err) {
      setError('Failed to load vehicles.');
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing !== null) {
        await apiClient.put(`/users/vehicles/${editing}/`, form);
      } else {
        await apiClient.post('/users/vehicles/', form);
      }
      setForm({ make: '', model: '', year: '', license_plate: '' });
      setEditing(null);
      fetchVehicles();
    } catch (err) {
      setError('Failed to save vehicle.');
    }
  };

  const handleEdit = (v: any) => {
    setForm({ make: v.make, model: v.model, year: v.year, license_plate: v.license_plate });
    setEditing(v.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await apiClient.delete(`/users/vehicles/${id}/`);
      fetchVehicles();
    } catch {
      setError('Failed to delete vehicle.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">My Vehicles</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
          <input name="make" placeholder="Make" value={form.make} onChange={handleChange} required className="p-2 border rounded flex-1" />
          <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required className="p-2 border rounded flex-1" />
          <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required className="p-2 border rounded w-24" />
          <input name="license_plate" placeholder="License Plate" value={form.license_plate} onChange={handleChange} required className="p-2 border rounded w-32" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editing !== null ? 'Update' : 'Add'}</button>
          {editing !== null && <button type="button" onClick={() => { setEditing(null); setForm({ make: '', model: '', year: '', license_plate: '' }); }} className="ml-2 text-gray-600 underline">Cancel</button>}
        </form>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Make</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">License Plate</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td className="p-2 border">{v.make}</td>
                <td className="p-2 border">{v.model}</td>
                <td className="p-2 border">{v.year}</td>
                <td className="p-2 border">{v.license_plate}</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(v)} className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
