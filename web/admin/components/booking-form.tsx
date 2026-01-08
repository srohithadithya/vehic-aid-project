import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BookingFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function BookingForm({ initialData = {}, onSubmit, onCancel, loading }: BookingFormProps) {
  const [form, setForm] = useState({
    customer: initialData.customer || "",
    provider: initialData.provider || "",
    service_type: initialData.service_type || "",
    status: initialData.status || "PENDING",
    location: initialData.location || "",
    description: initialData.description || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="customer" placeholder="Customer" value={form.customer} onChange={handleChange} required />
      <Input name="provider" placeholder="Provider" value={form.provider} onChange={handleChange} />
      <Input name="service_type" placeholder="Service Type" value={form.service_type} onChange={handleChange} required />
      <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}
