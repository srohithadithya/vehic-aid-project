import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiClient.post('/auth/register/', form);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center text-sm">{success}</div>}
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="mb-6 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-blue-600 hover:underline">Already have an account?</a>
        </div>
      </form>
    </div>
  );
}
