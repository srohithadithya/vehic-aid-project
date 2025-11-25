import { useState } from 'react';
import apiClient from '../lib/api';

export default function ServiceRequest() {
  const [form, setForm] = useState({
    vehicle: '',
    service_type: '',
    location: '',
    description: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiClient.post('/services/requests/', form);
      setSuccess('Service request submitted!');
      setForm({ vehicle: '', service_type: '', location: '', description: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit request.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Request a Service</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center text-sm">{success}</div>}
        <input name="vehicle" placeholder="Vehicle" value={form.vehicle} onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input name="service_type" placeholder="Service Type" value={form.service_type} onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="mb-6 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit Request</button>
      </form>
    </div>
  );
}
