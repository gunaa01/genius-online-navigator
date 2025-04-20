import React from "react";

const Pricing = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Pricing</h1>
    <p className="mb-8 text-lg">Choose the plan that fits your business. Simple, transparent pricing—no hidden fees.</p>
    <div className="grid gap-8 md:grid-cols-3">
      <div className="border rounded-lg p-6 bg-background shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Starter</h2>
        <div className="text-3xl font-bold mb-2">Free</div>
        <ul className="mb-4 list-disc ml-5 text-lg">
          <li>Basic dashboard access</li>
          <li>Email support</li>
        </ul>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold w-full">Get Started</button>
      </div>
      <div className="border rounded-lg p-6 bg-background shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Pro</h2>
        <div className="text-3xl font-bold mb-2">$29/mo</div>
        <ul className="mb-4 list-disc ml-5 text-lg">
          <li>Advanced analytics</li>
          <li>Integrations</li>
          <li>Priority support</li>
        </ul>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold w-full">Start Pro Trial</button>
      </div>
      <div className="border rounded-lg p-6 bg-background shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
        <div className="text-3xl font-bold mb-2">Contact Us</div>
        <ul className="mb-4 list-disc ml-5 text-lg">
          <li>Custom integrations</li>
          <li>Dedicated success manager</li>
          <li>Custom SLAs</li>
        </ul>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold w-full">Contact Sales</button>
      </div>
    </div>
  </main>
);

export default Pricing;
