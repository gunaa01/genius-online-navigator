import React from "react";

const Docs = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Documentation</h1>
    <p className="mb-8 text-lg">Browse our guides and API docs to make the most of Genius.</p>
    <ul className="list-disc ml-6 text-lg">
      <li><a href="#" className="text-green-600 underline">Getting Started Guide</a></li>
      <li><a href="#" className="text-green-600 underline">API Reference</a></li>
      <li><a href="#" className="text-green-600 underline">Integration Guides</a></li>
      <li><a href="#" className="text-green-600 underline">Best Practices</a></li>
    </ul>
  </main>
);

export default Docs;
