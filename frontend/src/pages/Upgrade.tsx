
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import PricingTiers from "@/components/common/PricingTiers";

const Upgrade = () => {
  const features = {
    basic: [
      "Dashboard analytics",
      "Social media integration (2 accounts)",
      "Basic reports",
      "5 AI content generations per month",
      "Email support",
      "Single user"
    ],
    pro: [
      "Everything in Basic",
      "Advanced analytics",
      "Social media integration (10 accounts)",
      "Unlimited reports",
      "100 AI content generations per month",
      "Email & chat support",
      "Up to 5 team members",
      "Ad campaign management",
      "Custom report scheduling"
    ],
    enterprise: [
      "Everything in Pro",
      "Unlimited social accounts",
      "Unlimited team members",
      "Unlimited AI content generation",
      "Dedicated account manager",
      "Custom integrations",
      "API access",
      "Phone, email & chat support",
      "Advanced security features",
      "Custom branding options"
    ]
  };

  const comparisons = [
    {
      feature: "Dashboard Access",
      basic: "Basic metrics",
      pro: "Advanced metrics",
      enterprise: "Custom metrics"
    },
    {
      feature: "Social Media Accounts",
      basic: "2",
      pro: "10",
      enterprise: "Unlimited"
    },
    {
      feature: "AI Content Generation",
      basic: "5/month",
      pro: "100/month",
      enterprise: "Unlimited"
    },
    {
      feature: "Team Members",
      basic: "1",
      pro: "Up to 5",
      enterprise: "Unlimited"
    },
    {
      feature: "Reports",
      basic: "Basic reports",
      pro: "Advanced reports",
      enterprise: "Custom reports"
    },
    {
      feature: "Support",
      basic: "Email only",
      pro: "Email & chat",
      enterprise: "Priority support"
    },
    {
      feature: "Ad Campaign Management",
      basic: "✕",
      pro: "✓",
      enterprise: "✓"
    },
    {
      feature: "API Access",
      basic: "✕",
      pro: "✕",
      enterprise: "✓"
    },
    {
      feature: "Custom Integrations",
      basic: "✕",
      pro: "✕",
      enterprise: "✓"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-8 w-8 text-accent" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Genius
            </span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to grow your business with powerful marketing and analytics tools
          </p>
        </div>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="comparison">Features Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="plans">
            <PricingTiers />

            <div className="mt-16 bg-secondary/30 border border-primary/10 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Need a custom solution?</h3>
                  <p className="text-muted-foreground">Contact our sales team to build a custom package for your specific needs</p>
                </div>
                <Button className="whitespace-nowrap">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card className="border">
              <CardHeader>
                <CardTitle>Features Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-center p-3">Basic</th>
                        <th className="text-center p-3">Pro</th>
                        <th className="text-center p-3">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisons.map((item, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'bg-secondary/30' : ''}`}>
                          <td className="p-3 font-medium">{item.feature}</td>
                          <td className="text-center p-3">{item.basic}</td>
                          <td className="text-center p-3 bg-primary/5">{item.pro}</td>
                          <td className="text-center p-3">{item.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-6">
                <Button className="flex gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the 7-day free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your free trial gives you full access to all Pro features for 7 days. You won't be charged until the trial ends, and you can cancel anytime before then with no obligation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll get immediate access to the new features. If you downgrade, the changes will take effect at the end of your current billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we can also arrange invoice payments.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No, there are no setup fees for any of our plans. You only pay the advertised monthly or annual subscription price.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
          <div className="flex justify-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <p className="text-sm">7-day free trial</p>
            <CheckCircle2 className="h-6 w-6 text-primary ml-6" />
            <p className="text-sm">No credit card required</p>
            <CheckCircle2 className="h-6 w-6 text-primary ml-6" />
            <p className="text-sm">Cancel anytime</p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button variant="link">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
