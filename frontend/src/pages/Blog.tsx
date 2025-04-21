import React from "react";

const mockPosts = [
  {
    title: "Welcome to the Genius Blog!",
    date: "2025-04-19",
    excerpt: "Get the latest updates, tips, and stories from the Genius team.",
    slug: "welcome-to-genius-blog"
  },
  {
    title: "How to Grow Your Business Online in 2025",
    date: "2025-04-10",
    excerpt: "Our top strategies for digital growth and success this year.",
    slug: "grow-your-business-online-2025"
  },
  {
    title: "Feature Spotlight: The Genius Dashboard",
    date: "2025-03-28",
    excerpt: "A deep dive into our dashboard and how it helps you stay in flow.",
    slug: "feature-spotlight-dashboard"
  }
];

const Blog = () => (
  <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
    <h1 className="text-4xl font-bold mb-8">Genius Blog</h1>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {mockPosts.map((post) => (
        <article key={post.slug} className="border rounded-lg p-6 bg-background shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          <div className="text-muted-foreground text-sm mb-2">{post.date}</div>
          <p className="mb-4">{post.excerpt}</p>
          <a href="#" className="text-green-600 hover:underline font-semibold">Read More</a>
        </article>
      ))}
    </div>
  </main>
);

export default Blog;
