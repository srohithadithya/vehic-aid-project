import { useState } from 'react';
import apiClient from '../../lib/api';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiClient.post('/auth/password/reset/', { email });
      setMessage('If this email is registered, a reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send reset email.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        {message && <div className="mb-4 text-green-600 text-center text-sm">{message}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-6 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send Reset Link</button>
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-blue-600 hover:underline">Back to login</a>
        </div>
      </form>
    </div>
  );
}
