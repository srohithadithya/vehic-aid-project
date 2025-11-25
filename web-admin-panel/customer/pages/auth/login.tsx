import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Login</h2>
        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="mb-4 w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="mb-6 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        <div className="mt-4 text-center">
          <a href="/auth/register" className="text-blue-600 hover:underline">Create an account</a>
        </div>
        <div className="mt-2 text-center">
          <a href="/auth/reset" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
      </form>
    </div>
  );
}
