import React from "react";

const Careers = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">Careers at Genius</h1>
    <p className="mb-8 text-lg">Join our fast-growing, remote-first team and help shape the future of business technology. We’re always looking for passionate, talented people!</p>
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-2">Open Positions</h2>
      <ul className="list-disc ml-6 text-lg">
        <li>Frontend Engineer (React/Next.js)</li>
        <li>Backend Engineer (Node.js/TypeScript)</li>
        <li>Product Designer</li>
        <li>Growth Marketer</li>
      </ul>
      <p className="mt-4">To apply, send your resume and a short intro to <a href="mailto:careers@genius.com" className="text-green-600 underline">careers@genius.com</a>.</p>
    </section>
  </main>
);

export default Careers;
