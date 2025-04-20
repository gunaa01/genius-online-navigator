import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-8 text-lg">Have a question, feedback, or want to partner with us? Fill out the form below and our team will get back to you soon.</p>
      {submitted ? (
        <div className="bg-green-100 text-green-700 p-4 rounded">Thank you for reaching out! We'll be in touch soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
            <input className="w-full border rounded px-3 py-2" type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" id="email" name="email" required value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="message">Message</label>
            <textarea className="w-full border rounded px-3 py-2" id="message" name="message" rows={5} required value={form.message} onChange={handleChange} />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">Send Message</button>
        </form>
      )}
    </main>
  );
};

export default Contact;
