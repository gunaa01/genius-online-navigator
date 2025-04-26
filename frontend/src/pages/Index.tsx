
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Welcome to Genius</h1>
        <p className="text-xl mb-8">The all-in-one platform to grow your business online</p>
        <div className="space-y-4">
          <p>This is the homepage of the Genius application.</p>
          <Button asChild>
            <Link to="/offline-to-online">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
