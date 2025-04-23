import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, BarChart3, FileBarChart, Target, Share2, MessageSquareText, UsersRound, Plug, Users, Settings, Store, Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { Helmet } from 'react-helmet';
import Menu from "@/components/Menu";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const pages = [
    {
      title: "Dashboard",
      description: "Get a complete overview of your business performance and key metrics.",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      title: "Analytics",
      description: "Dive deep into your data with interactive charts and detailed insights.",
      icon: BarChart3,
      path: "/analytics"
    },
    {
      title: "Reports",
      description: "Generate and download comprehensive reports for your business.",
      icon: FileBarChart,
      path: "/reports"
    },
    {
      title: "Ad Campaigns",
      description: "Create, manage, and optimize your advertising campaigns across platforms.",
      icon: Target,
      path: "/ads"
    },
    {
      title: "Social Media",
      description: "Schedule posts and manage all your social media accounts in one place.",
      icon: Share2,
      path: "/social"
    },
    {
      title: "AI Content",
      description: "Generate engaging content with our AI-powered content creation tools.",
      icon: MessageSquareText,
      path: "/content"
    },
    {
      title: "Community",
      description: "Connect with local businesses and customers to grow together.",
      icon: UsersRound,
      path: "/community"
    },
    {
      title: "Integrations",
      description: "Connect your favorite tools and platforms for a seamless workflow.",
      icon: Plug,
      path: "/integrations"
    },
    {
      title: "Team",
      description: "Manage team members and their permissions to enhance collaboration.",
      icon: Users,
      path: "/team"
    },
    {
      title: "Settings",
      description: "Configure your account settings and preferences.",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Genius - All-in-One Business Platform</title>
        <meta name="description" content="Genius is an all-in-one platform designed to help businesses grow online." />
        <meta property="og:title" content="Genius - All-in-One Business Platform" />
        <meta property="og:description" content="Genius is an all-in-one platform designed to help businesses grow online." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Genius - All-in-One Business Platform" />
        <meta name="twitter:description" content="Genius is an all-in-one platform designed to help businesses grow online." />
        <meta name="twitter:image" content="/logo.png" />
      </Helmet>
      <Menu />
      <main className="pt-20 bg-background min-h-screen text-foreground transition-colors duration-300">
        <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">Welcome to Genius</h1>
            <p className="text-2xl mb-8 text-muted-foreground">The all-in-one platform to grow your business online</p>
            <div className="flex gap-4">
              {!loading && !user && (
                <Button asChild variant="default" size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Link to="/auth">Get Started</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-green-400 text-green-400 hover:bg-green-900/10 dark:hover:bg-green-100/10">
                <Link to="/offline-to-online">Take Your Business Online</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center">
            {/* Social Icons row */}
            <div className="flex gap-3 text-2xl" aria-label="Social links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="hover:text-green-400" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter className="hover:text-green-400" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="hover:text-green-400" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube className="hover:text-green-400" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="hover:text-green-400" /></a>
            </div>
          </div>
        </section>
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.title} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <page.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{page.title}</CardTitle>
                  </div>
                  <CardDescription className="pt-2 text-muted-foreground">{page.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button asChild variant="ghost" className="w-full justify-between">
                    <Link to={page.path}>
                      Explore {page.title} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      {/* Newsletter Signup Section */}
      <section className="w-full bg-green-50 dark:bg-green-900/10 py-8 mb-[-2rem] border-b border-green-200 dark:border-green-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-300">Stay in the loop</h3>
            <p className="text-muted-foreground mb-2">Subscribe to our newsletter for updates, tips, and exclusive offers.</p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
      <footer className="bg-background border-t border-gray-200 dark:border-gray-800 py-12 mt-12 transition-colors duration-300">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-green-400 text-2xl font-bold"><span>&#8765;</span> Genius</div>
            <p className="text-muted-foreground">Built to keep you in flow state.</p>
            <div className="flex gap-3 mt-2 text-xl">
              <a href="#" className="hover:text-green-400"><i className="fab fa-discord"></i></a>
              <a href="#" className="hover:text-green-400"><i className="fab fa-tiktok"></i></a>
              <a href="#" className="hover:text-green-400"><i className="fab fa-x-twitter"></i></a>
              <a href="#" className="hover:text-green-400"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="hover:text-green-400"><i className="fab fa-youtube"></i></a>
              <a href="#" className="hover:text-green-400"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><a href="/docs">Docs</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Capabilities</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/about-us">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><a href="/about-us">About Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><a href="/docs">Docs</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/community">Community</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

// NewsletterSignup component
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };
  return submitted ? (
    <div className="text-green-700 dark:text-green-300 font-semibold">Thank you for subscribing!</div>
  ) : (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        placeholder="Your email"
        className="px-4 py-2 rounded border border-gray-300 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-background"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
      >
        Subscribe
      </button>
    </form>
  );
};

export default Index;
