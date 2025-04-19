import React from "react";

const Terms = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
    <p className="mb-4 text-lg">Welcome to Genius. By using our platform, you agree to the following terms and conditions.</p>
    <h2 className="text-2xl font-bold mt-8 mb-2">1. Use of Service</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>You must be at least 13 years old to use Genius.</li>
      <li>Use the platform only for lawful purposes.</li>
      <li>Do not misuse or attempt to disrupt our services.</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">2. Accounts</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>You are responsible for maintaining the security of your account.</li>
      <li>Notify us immediately of any unauthorized use.</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">3. Intellectual Property</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>All content and software is the property of Genius or its licensors.</li>
      <li>Do not copy, modify, or distribute our content without permission.</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">4. Termination</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>We may suspend or terminate your account for violations of these terms.</li>
    </ul>
    <h2 className="text-2xl font-bold mt-8 mb-2">5. Liability</h2>
    <ul className="list-disc ml-6 text-lg">
      <li>Genius is provided "as is" without warranties.</li>
      <li>We are not liable for damages or losses resulting from your use of the platform.</li>
    </ul>
    <p className="mt-8">For questions, contact <a href="mailto:support@genius.com" className="text-green-600 underline">support@genius.com</a>.</p>
  </main>
);

export default Terms;