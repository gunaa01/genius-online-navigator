
import React from 'react';

export default function ActionForm() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Action Form</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Select an action to configure your automation workflow
      </p>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Send Email</h3>
          <p className="text-sm text-gray-500">Send an automated email to contacts</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Create Task</h3>
          <p className="text-sm text-gray-500">Create a task in your project management system</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Post to Social Media</h3>
          <p className="text-sm text-gray-500">Publish content to connected social platforms</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Add to CRM</h3>
          <p className="text-sm text-gray-500">Create or update contact in your CRM</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Generate Report</h3>
          <p className="text-sm text-gray-500">Generate and send automated reports</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-2">
        <button 
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
