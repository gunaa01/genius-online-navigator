import React from "react";

const Support = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Support</h1>
    <p className="mb-4 text-lg">Need help? Our support team is here for you. Browse our resources or contact us directly for assistance.</p>
    <ul className="list-disc ml-6 text-lg mb-8">
      <li>Check our <a href="/faq" className="text-green-600 underline">FAQ</a></li>
      <li>Read our <a href="/docs" className="text-green-600 underline">Documentation</a></li>
      <li>Email us at <a href="mailto:support@genius.com" className="text-green-600 underline">support@genius.com</a></li>
    </ul>
    <div className="bg-green-50 border border-green-200 rounded p-6">
      <h2 className="text-2xl font-semibold mb-2">Live Chat (Coming Soon!)</h2>
      <p>We’re building a live chat experience for real-time help. Stay tuned!</p>
    </div>
  </main>
);

export default Support;
