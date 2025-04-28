
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingTiers = () => {
  const plans = [
    {
      name: "Basic",
      description: "For small businesses just getting started",
      price: 49,
      billing: "monthly",
      features: [
        "Data integration for 1 website",
        "Weekly reports",
        "Basic analytics dashboard",
        "1 social media account",
        "5 AI content generations/month",
        "Email support"
      ],
      cta: "Start Basic",
      popular: false
    },
    {
      name: "Pro",
      description: "For growing businesses needing advanced tools",
      price: 99,
      billing: "monthly",
      features: [
        "Data integration for 3 websites",
        "Daily reports",
        "Advanced analytics with insights",
        "5 social media accounts",
        "50 AI content generations/month",
        "Ad campaign management",
        "Priority support"
      ],
      cta: "Start Pro",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For larger businesses with complex needs",
      price: 249,
      billing: "monthly",
      features: [
        "Unlimited data integrations",
        "Custom reports",
        "Advanced analytics with predictions",
        "Unlimited social media accounts",
        "Unlimited AI content generation",
        "Advanced ad campaign management",
        "A/B testing tools",
        "Dedicated account manager"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card key={plan.name} className={`relative card-shadow ${plan.popular ? 'border-primary' : ''}`}>
          {plan.popular && (
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/{plan.billing}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${plan.popular ? 'bg-primary' : ''}`}
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingTiers;
