import React from "react";

const Privacy = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
    <p className="mb-4 text-lg">Your privacy is important to us. This policy explains how Genius collects, uses, and protects your information.</p>
    <h2 className="text-2xl font-bold mt-8 mb-2">What We Collect</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>Account information (name, email)</li>
      <li>Usage data (how you use Genius)</li>
      <li>Cookies and analytics</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">How We Use Your Data</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>To provide and improve our services</li>
      <li>To communicate with you</li>
      <li>To ensure security and compliance</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">Your Rights</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>Access and update your data</li>
      <li>Request deletion</li>
      <li>Contact us for privacy questions</li>
    </ul>
    <p className="mt-8">For more details, contact <a href="mailto:privacy@genius.com" className="text-green-600 underline">privacy@genius.com</a>.</p>
  </main>
);

export default Privacy;
