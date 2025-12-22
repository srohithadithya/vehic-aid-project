import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface UserFormProps {
  initialData?: {
    username?: string;
    email?: string;
    phone_number?: string;
    role?: string;
    is_active?: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserForm({ initialData = {}, onSubmit, onCancel, loading }: UserFormProps) {
  const [form, setForm] = useState({
    username: initialData.username || "",
    email: initialData.email || "",
    phone_number: initialData.phone_number || "",
    role: initialData.role || "CUSTOMER",
    is_active: initialData.is_active ?? true,
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
      <Input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
        <option value="CUSTOMER">Customer</option>
        <option value="PROVIDER">Provider</option>
        <option value="ADMIN">Admin</option>
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
      </label>
      {!initialData.username && (
        <Input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" required />
      )}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}
