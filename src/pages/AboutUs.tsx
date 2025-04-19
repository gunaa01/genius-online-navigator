import React from "react";

const AboutUs = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-6">About Us</h1>
    <p className="mb-4 text-lg">Genius is built by a passionate team dedicated to empowering businesses to grow online. Our mission is to provide seamless, powerful, and elegant tools that make business management effortless for everyone.</p>
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-2">Our Story</h2>
      <p className="mb-4">Founded in 2025, Genius started as a vision to simplify digital business operations. Today, we serve thousands of users worldwide, helping them achieve more with less effort.</p>
    </section>
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-2">Our Values</h2>
      <ul className="list-disc ml-6 text-lg">
        <li>Innovation & Simplicity</li>
        <li>Customer-Centricity</li>
        <li>Transparency & Trust</li>
        <li>Continuous Improvement</li>
      </ul>
    </section>
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-2">Meet the Team</h2>
      <p>We're a diverse group of engineers, designers, and business experts who believe in the power of technology to transform businesses.</p>
    </section>
  </main>
);

export default AboutUs;
