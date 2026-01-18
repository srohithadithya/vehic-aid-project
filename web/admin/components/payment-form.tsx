import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PaymentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function PaymentForm({ initialData = {}, onSubmit, onCancel, loading }: PaymentFormProps) {
  const [form, setForm] = useState({
    user: initialData.user || "",
    amount: initialData.amount || "",
    status: initialData.status || "PENDING",
    payment_method: initialData.payment_method || "",
    transaction_id: initialData.transaction_id || "",
    service_request_id: initialData.service_request_id || ""
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
      <Input name="user" placeholder="User" value={form.user} onChange={handleChange} required />
      <Input name="amount" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required type="number" />
      <Input name="payment_method" placeholder="Payment Method" value={form.payment_method} onChange={handleChange} />
      <Input name="transaction_id" placeholder="Transaction ID" value={form.transaction_id} onChange={handleChange} />
      <Input name="service_request_id" placeholder="Service Request ID" value={form.service_request_id} onChange={handleChange} />
      <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
        <option value="PENDING">Pending</option>
        <option value="SUCCESS">Success</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}
