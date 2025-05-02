
import React from 'react';

export default function TriggerForm() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Trigger Form</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Select a trigger to start your automation workflow
      </p>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">New Website Visitor</h3>
          <p className="text-sm text-gray-500">Trigger when a new visitor lands on your website</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Form Submission</h3>
          <p className="text-sm text-gray-500">Trigger when a user submits a form</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Email Opened</h3>
          <p className="text-sm text-gray-500">Trigger when a recipient opens your email</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Social Media Mention</h3>
          <p className="text-sm text-gray-500">Trigger when your brand is mentioned on social media</p>
        </div>
        
        <div className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors">
          <h3 className="font-medium">Schedule</h3>
          <p className="text-sm text-gray-500">Trigger at scheduled times (daily, weekly, monthly)</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
