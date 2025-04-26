
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Menu from "@/components/Menu";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Menu />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="max-w-md w-full px-4 py-8 text-center space-y-6">
          <div className="rounded-full bg-muted w-20 h-20 mx-auto flex items-center justify-center">
            <span className="text-4xl font-bold">404</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Page not found</h1>
            <p className="text-muted-foreground">
              We couldn't find the page you're looking for. The page may have been moved or deleted.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild variant="default" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/for-hire">
                <ArrowLeft className="h-4 w-4" /> Back to For Hire
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-muted-foreground text-sm">
          <p>Need assistance? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
