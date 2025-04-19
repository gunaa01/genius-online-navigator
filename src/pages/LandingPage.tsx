import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, BarChart3, FileBarChart, Target, Share2, MessageSquareText, UsersRound, Plug, Users, Settings, Store } from "lucide-react";
import { Helmet } from 'react-helmet';

const LandingPage = () => {
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
      </Helmet>
    <div className="min-h-screen bg-background">
        <nav className="bg-background p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-lg font-bold">Genius</Link>
            <div className="flex gap-4">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </div>
        </nav>

      <header className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Genius</h1>
          <p className="text-xl mb-8">The all-in-one platform to grow your business online</p>
          <div className="flex gap-4">
            <Button asChild variant="secondary" size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" size="lg">
              <Link to="/offline-to-online">Take Your Business Online</Link>
            </Button>
          </div>
        </div>
      </header>

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
                <CardDescription className="pt-2">{page.description}</CardDescription>
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

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg mb-8">"Genius has transformed the way we do business!" - Happy Customer</p>
            <p className="text-lg mb-8">"The analytics tools are incredibly powerful." - Satisfied User</p>
            {/* Add more testimonials as needed */}
          </div>
        </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of businesses that use Genius to grow their online presence, engage with customers, and increase revenue.</p>
          <Button asChild size="lg">
            <Link to="/auth">Sign Up for Free</Link>
          </Button>
        </div>
      </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Q: What is Genius?</h3>
              <p>A: Genius is an all-in-one platform designed to help businesses grow online.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Q: How can I get started?</h3>
              <p>A: You can get started by signing up for a free account on our website.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Q: Is there a mobile app?</h3>
              <p>A: Yes, we offer a mobile app for both iOS and Android devices.</p>
            </div>
            {/* Add more FAQs as needed */}
          </div>
        </section>

      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">© 2025 Genius. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;
