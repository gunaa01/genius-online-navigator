import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Globe, ShoppingBag, SearchCheck, Share, CreditCard, MessagesSquare, BarChart3 } from "lucide-react";
import { target as Target } from 'lucide-react/dist/icons';

const OfflineToOnline = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/landing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Taking Your Offline Business Online</h1>
            <p className="text-lg text-muted-foreground">A step-by-step guide to establishing an effective online presence for your business</p>
          </header>
          
          <Tabs defaultValue="planning" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="planning">Planning & Setup</TabsTrigger>
              <TabsTrigger value="marketing">Digital Marketing</TabsTrigger>
              <TabsTrigger value="operations">Operations & Growth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="planning" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <CardTitle>Define Your Online Goals</CardTitle>
                    </div>
                    <CardDescription>
                      Consider what you want to achieve with your online presence:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Sell products online (e-commerce)</li>
                      <li>Generate leads for your service-based business</li>
                      <li>Increase brand awareness</li>
                      <li>Offer online bookings and appointments</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle>Domain & Hosting Setup</CardTitle>
                    </div>
                    <CardDescription>
                      Establish your online foundation:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Domain:</strong> Choose a simple, brandable name (e.g., YourBusinessName.com)</li>
                      <li><strong>Providers:</strong> Namecheap, GoDaddy, Google Domains</li>
                      <li><strong>Hosting:</strong> Bluehost, SiteGround, or Hostinger (for WordPress)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <CardTitle>Build Your Website</CardTitle>
                    </div>
                    <CardDescription>
                      Choose the right platform for your business needs:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Website Options:</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>Website Builders:</strong> Shopify (e-commerce), Wix/Squarespace (general)</li>
                          <li><strong>WordPress + WooCommerce:</strong> More customizable but requires more setup</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Essential Pages:</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>Homepage</li>
                          <li>About Us</li>
                          <li>Products/Services</li>
                          <li>Contact Page (Phone, Email, Address, Google Maps)</li>
                          <li>Booking/Purchase Options (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <CardTitle>Set Up Online Payments</CardTitle>
                    </div>
                    <CardDescription>
                      If selling products or services online:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Payment Gateways:</strong> Stripe, PayPal, Razorpay (India), Square</li>
                      <li><strong>POS Integration:</strong> Square, Shopify POS, Clover (if you need offline & online sync)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="marketing" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <SearchCheck className="h-5 w-5 text-primary" />
                      <CardTitle>Google My Business Listing</CardTitle>
                    </div>
                    <CardDescription>
                      Help local customers find you on Google Search & Maps:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal ml-6 space-y-2">
                      <li>Go to <a href="https://www.google.com/business/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Business Profile</a></li>
                      <li>Add business name, address, phone, website, photos</li>
                      <li>Verify via postcard or phone</li>
                      <li>Keep information updated and respond to reviews</li>
                    </ol>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Share className="h-5 w-5 text-primary" />
                      <CardTitle>Social Media Presence</CardTitle>
                    </div>
                    <CardDescription>
                      Build engagement and awareness:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Recommended Platforms:</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>Facebook & Instagram:</strong> For engagement & ads</li>
                          <li><strong>LinkedIn:</strong> For B2B businesses</li>
                          <li><strong>YouTube/TikTok:</strong> If video content works for your niche</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Content Ideas:</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>Product photos</li>
                          <li>Behind-the-scenes content</li>
                          <li>Promotions and special offers</li>
                          <li>Customer testimonials</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle>Online Advertising</CardTitle>
                    </div>
                    <CardDescription>
                      Strategic advertising to reach your target audience:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Google Ads:</strong> For search traffic (e.g., "Best bakery near me")</li>
                      <li><strong>Facebook/Instagram Ads:</strong> For brand awareness & sales</li>
                      <li><strong>Retargeting Ads:</strong> To bring back website visitors who didn't convert</li>
                      <li><strong>Local SEO:</strong> Optimize for "near me" searches</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <MessagesSquare className="h-5 w-5 text-primary" />
                      <CardTitle>Email & SMS Marketing</CardTitle>
                    </div>
                    <CardDescription>
                      Direct communication with customers:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Collect emails via website pop-ups or in-store sign-ups</li>
                      <li>Use Mailchimp, Klaviyo, or Brevo for email campaigns</li>
                      <li>Send discounts, newsletters, and updates</li>
                      <li>Segment your audience for targeted messaging</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="operations" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <CardTitle>Online Booking & Ordering</CardTitle>
                    </div>
                    <CardDescription>
                      Make it easy for customers to do business with you:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Restaurants:</strong> Uber Eats, Zomato, or your own website (via Toast, GloriaFood)</li>
                      <li><strong>Service Businesses:</strong> Calendly, Bookeo, or WordPress booking plugins</li>
                      <li><strong>Retail:</strong> E-commerce with local pickup or delivery options</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <MessagesSquare className="h-5 w-5 text-primary" />
                      <CardTitle>Customer Support</CardTitle>
                    </div>
                    <CardDescription>
                      Provide excellent service across channels:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Live Chat:</strong> Tawk.to, WhatsApp Business, or Facebook Messenger</li>
                      <li><strong>FAQ Page:</strong> Reduce repetitive queries</li>
                      <li><strong>Response Time:</strong> Aim to respond within 24 hours</li>
                      <li><strong>Multi-channel Support:</strong> Email, phone, social media</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <CardTitle>Track Performance & Optimize</CardTitle>
                    </div>
                    <CardDescription>
                      Monitor and improve your digital presence:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-6 space-y-2">
                      <li><strong>Google Analytics:</strong> Track website traffic sources and behavior</li>
                      <li><strong>Social Media Insights:</strong> Monitor engagement metrics</li>
                      <li><strong>Google My Business Analytics:</strong> See how customers find you</li>
                      <li><strong>A/B Testing:</strong> Test different ads, website layouts, and offers</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Final Tips for Success</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="list-disc ml-6 space-y-3">
                      <li><strong>Start simple</strong> – Don't overcomplicate; a basic website + Google My Business is a great start.</li>
                      <li><strong>Leverage local SEO</strong> – Optimize for "near me" searches and local intent.</li>
                      <li><strong>Encourage reviews</strong> – Ask happy customers to leave Google/Facebook reviews.</li>
                      <li><strong>Be consistent</strong> – Post regularly on social media & update your website.</li>
                      <li><strong>Track what works</strong> – Use analytics to understand which channels drive results.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-muted p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-3">Ready to take your business online?</h3>
            <p className="mb-6">Genius provides all the tools you need to establish and grow your online presence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth">Get Started with Genius</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/upgrade">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineToOnline;
