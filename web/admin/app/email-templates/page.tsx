'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Edit, Save, Eye } from 'lucide-react';

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Service Request Confirmation', subject: 'Service Request #{id} - Confirmation', active: true },
        { id: 2, name: 'Provider Assigned', subject: 'Provider Assigned - Request #{id}', active: true },
        { id: 3, name: 'Service Completed', subject: 'Service Completed - Request #{id}', active: true },
        { id: 4, name: 'Payment Receipt', subject: 'Payment Successful - Request #{id}', active: true },
    ]);

    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [editing, setEditing] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Email Templates</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template List */}
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Templates</h2>
                    <div className="space-y-2">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className={`p-3 rounded-lg cursor-pointer transition ${selectedTemplate?.id === template.id
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="font-medium">{template.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {template.subject}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Template Editor */}
                <Card className="p-6 lg:col-span-2">
                    {selectedTemplate ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setEditing(!editing)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        {editing ? 'Cancel' : 'Edit'}
                                    </Button>
                                    {editing && (
                                        <Button size="sm">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={selectedTemplate.subject}
                                        disabled={!editing}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">HTML Content</label>
                                    <textarea
                                        rows={15}
                                        disabled={!editing}
                                        defaultValue={`<html>
<body style="font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2563eb;">Service Request Confirmation</h2>
    <p>Dear {customer_name},</p>
    <p>Your service request has been received successfully.</p>
    
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
      <p><strong>Request ID:</strong> {request_id}</p>
      <p><strong>Service Type:</strong> {service_type}</p>
      <p><strong>Status:</strong> {status}</p>
    </div>
    
    <p>Thank you for using VehicAid!</p>
  </div>
</body>
</html>`}
                                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button variant="outline">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Test Email
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a template to edit
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
