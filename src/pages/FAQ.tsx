import React from "react";

const FAQ = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">What is Genius?</h2>
        <p>Genius is an all-in-one platform to help businesses grow online with dashboards, analytics, automation, and more.</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">How do I get started?</h2>
        <p>Click "Get Started" on the home page and follow the signup process. You can try the Starter plan for free.</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Can I upgrade later?</h2>
        <p>Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Do you offer support?</h2>
        <p>All plans include email support. Pro and Enterprise plans include priority and dedicated support.</p>
      </div>
    </div>
  </main>
);

export default FAQ;
