import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Menu from "@/components/Menu";

const OfflineToOnline = () => {
  return (
    <>
      <Menu />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">Taking Your Business Online</h1>
              <p className="text-xl text-muted-foreground">
                Follow this guide to transform your offline business into a thriving online presence
              </p>
            </div>
            
            <div className="grid gap-8">
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">Step 1: Choose Your Approach</h2>
                <p className="mb-4">
                  Decide whether you want to build your online presence yourself or hire professionals to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button asChild className="flex-1">
                    <Link to="/for-hire">Find Freelancers</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/hire">Post a Job</Link>
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">Step 2: Build Your Digital Foundation</h2>
                <p className="mb-4">
                  Set up your website, social media accounts, and business listings.
                </p>
                {/* Content would go here */}
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">Step 3: Market Your Business</h2>
                <p className="mb-4">
                  Learn effective digital marketing strategies to reach your target audience.
                </p>
                {/* Content would go here */}
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">Step 4: Analyze and Optimize</h2>
                <p className="mb-4">
                  Use data to improve your online presence and business performance.
                </p>
                {/* Content would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfflineToOnline;
