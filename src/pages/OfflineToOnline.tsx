import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ArrowRightIcon, 
  CheckCircle2, 
  Target 
} from "lucide-react";

const OfflineToOnline = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Taking Your Business Online: The Complete Guide</h1>
        <p className="text-muted-foreground mb-8">A step-by-step playbook for traditional businesses making the digital transition.</p>
        
        {/* Sections nav */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Prepare your business for going online</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Assess your digital readiness</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Research your online competitors</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Define your digital goals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Building Your Presence</CardTitle>
              <CardDescription>Create your digital storefront</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Choose your website platform</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Set up payment processing</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Create essential business pages</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Growing Your Business</CardTitle>
              <CardDescription>Attract and convert customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Implement a digital marketing plan</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Use analytics to improve performance</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Scale your online operations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Before You Begin: Digital Readiness</h2>
            <p className="mb-4">Taking your business online isn't just about creating a website – it requires a strategic approach to ensure success in the digital landscape. Here are the essential steps to prepare:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Key Questions to Answer:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    <span>What are your specific goals for going online? (e.g., selling products, generating leads, building brand awareness)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    <span>Who is your target audience online? Is it the same as your offline customers?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    <span>What resources (budget, time, skills) can you allocate to your online presence?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">4.</span>
                    <span>Who will be responsible for maintaining your online channels?</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Common Challenges:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Limited technical knowledge or digital skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Concerns about cyber security and data protection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Uncertainty about which digital channels to focus on</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Time constraints while running day-to-day operations</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 border-l-4 border-primary pl-4 italic">
              <p>"Going digital wasn't just about having a website – it was about transforming how we think about our business. Once we clarified our goals, everything else became easier."</p>
              <p className="text-sm text-muted-foreground mt-2">– Sarah Chen, Local Bookstore Owner</p>
            </div>
          </section>
          
          {/* Hiring help section with button to Hire page */}
          <section className="bg-muted p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Need help with your online transition?
                </h2>
                <p className="text-muted-foreground">
                  If you don't have the time or skills to handle everything yourself, our platform connects you with pre-vetted freelancers specializing in digital transformation.
                </p>
              </div>
              <div>
                <Link to="/hire">
                  <Button size="lg" className="w-full md:w-auto">
                    Find Freelancers
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Building Your Online Presence</h2>
            <p className="mb-4">With your goals defined, it's time to build your digital storefront. This involves choosing the right platform, setting up secure payment processing, and creating essential business pages.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Choosing Your Website Platform:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>E-commerce Platforms (Shopify, WooCommerce):</b> Ideal for selling products online with built-in shopping cart and inventory management.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Website Builders (Squarespace, Wix):</b> User-friendly options for creating visually appealing websites without coding.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Content Management Systems (WordPress):</b> Flexible platform for blogs, business sites, and e-commerce with plugins.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Setting Up Payment Processing:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Payment Gateways (Stripe, PayPal):</b> Integrate secure payment processing directly into your website.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Point-of-Sale (POS) Systems:</b> Sync online and offline sales with a unified system.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Mobile Payment Options (Apple Pay, Google Pay):</b> Offer convenient payment methods for mobile users.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Growing Your Online Business</h2>
            <p className="mb-4">With your website up and running, it's time to attract and convert customers. This involves implementing a digital marketing plan, using analytics to improve performance, and scaling your online operations.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Digital Marketing Strategies:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Search Engine Optimization (SEO):</b> Optimize your website to rank higher in search engine results.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Social Media Marketing:</b> Engage with customers on social media platforms.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Email Marketing:</b> Send targeted emails to promote products and services.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Paid Advertising (Google Ads, Facebook Ads):</b> Run targeted ads to reach potential customers.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold mb-3">Analytics and Performance Improvement:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Website Analytics (Google Analytics):</b> Track website traffic, user behavior, and conversions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>A/B Testing:</b> Experiment with different website elements to improve performance.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span><b>Customer Feedback:</b> Collect and analyze customer feedback to improve products and services.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OfflineToOnline;
