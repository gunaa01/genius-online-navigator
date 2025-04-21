
import { Button } from "@/components/ui/button";
import GuideNavCard from "@/components/offline-to-online/GuideNavCard";
import GuideSection from "@/components/offline-to-online/GuideSection";
import InfoBox from "@/components/offline-to-online/InfoBox";
import QuoteTestimonial from "@/components/offline-to-online/QuoteTestimonial";
import FreelancerCta from "@/components/offline-to-online/FreelancerCta";

const OfflineToOnline = () => {
  const navCards = [
    {
      title: "Getting Started",
      description: "Prepare your business for going online",
      items: [
        "Assess your digital readiness",
        "Research your online competitors",
        "Define your digital goals"
      ]
    },
    {
      title: "Building Your Presence",
      description: "Create your digital storefront",
      items: [
        "Choose your website platform",
        "Set up payment processing",
        "Create essential business pages"
      ]
    },
    {
      title: "Growing Your Business",
      description: "Attract and convert customers",
      items: [
        "Implement a digital marketing plan",
        "Use analytics to improve performance",
        "Scale your online operations"
      ]
    }
  ];

  const readinessQuestions = [
    {
      id: 1,
      content: "What are your specific goals for going online? (e.g., selling products, generating leads, building brand awareness)"
    },
    {
      id: 2,
      content: "Who is your target audience online? Is it the same as your offline customers?"
    },
    {
      id: 3,
      content: "What resources (budget, time, skills) can you allocate to your online presence?"
    },
    {
      id: 4,
      content: "Who will be responsible for maintaining your online channels?"
    }
  ];

  const challenges = [
    {
      id: 1,
      content: "Limited technical knowledge or digital skills"
    },
    {
      id: 2,
      content: "Concerns about cyber security and data protection"
    },
    {
      id: 3,
      content: "Uncertainty about which digital channels to focus on"
    },
    {
      id: 4,
      content: "Time constraints while running day-to-day operations"
    }
  ];

  const platformTypes = [
    {
      id: 1,
      content: <span><b>E-commerce Platforms (Shopify, WooCommerce):</b> Ideal for selling products online with built-in shopping cart and inventory management.</span>
    },
    {
      id: 2,
      content: <span><b>Website Builders (Squarespace, Wix):</b> User-friendly options for creating visually appealing websites without coding.</span>
    },
    {
      id: 3,
      content: <span><b>Content Management Systems (WordPress):</b> Flexible platform for blogs, business sites, and e-commerce with plugins.</span>
    }
  ];

  const paymentOptions = [
    {
      id: 1,
      content: <span><b>Payment Gateways (Stripe, PayPal):</b> Integrate secure payment processing directly into your website.</span>
    },
    {
      id: 2,
      content: <span><b>Point-of-Sale (POS) Systems:</b> Sync online and offline sales with a unified system.</span>
    },
    {
      id: 3,
      content: <span><b>Mobile Payment Options (Apple Pay, Google Pay):</b> Offer convenient payment methods for mobile users.</span>
    }
  ];

  const marketingStrategies = [
    {
      id: 1,
      content: <span><b>Search Engine Optimization (SEO):</b> Optimize your website to rank higher in search engine results.</span>
    },
    {
      id: 2,
      content: <span><b>Social Media Marketing:</b> Engage with customers on social media platforms.</span>
    },
    {
      id: 3,
      content: <span><b>Email Marketing:</b> Send targeted emails to promote products and services.</span>
    },
    {
      id: 4,
      content: <span><b>Paid Advertising (Google Ads, Facebook Ads):</b> Run targeted ads to reach potential customers.</span>
    }
  ];

  const analyticsOptions = [
    {
      id: 1,
      content: <span><b>Website Analytics (Google Analytics):</b> Track website traffic, user behavior, and conversions.</span>
    },
    {
      id: 2,
      content: <span><b>A/B Testing:</b> Experiment with different website elements to improve performance.</span>
    },
    {
      id: 3,
      content: <span><b>Customer Feedback:</b> Collect and analyze customer feedback to improve products and services.</span>
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Taking Your Business Online: The Complete Guide</h1>
        <p className="text-muted-foreground mb-8">A step-by-step playbook for traditional businesses making the digital transition.</p>
        
        {/* Sections nav */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {navCards.map((card, index) => (
            <GuideNavCard 
              key={index}
              title={card.title}
              description={card.description}
              items={card.items}
            />
          ))}
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Section 1 */}
          <GuideSection title="Before You Begin: Digital Readiness">
            <p className="mb-4">Taking your business online isn't just about creating a website – it requires a strategic approach to ensure success in the digital landscape. Here are the essential steps to prepare:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <InfoBox 
                title="Key Questions to Answer:" 
                items={readinessQuestions} 
                numbered={true} 
              />
              
              <InfoBox 
                title="Common Challenges:" 
                items={challenges} 
              />
            </div>
            
            <div className="mt-6">
              <QuoteTestimonial 
                quote="Going digital wasn't just about having a website – it was about transforming how we think about our business. Once we clarified our goals, everything else became easier."
                author="Sarah Chen"
                title="Local Bookstore Owner"
              />
            </div>
          </GuideSection>
          
          {/* Hiring help section with button to Hire page */}
          <FreelancerCta 
            title="Need help with your online transition?"
            description="If you don't have the time or skills to handle everything yourself, our platform connects you with pre-vetted freelancers specializing in digital transformation."
            buttonText="Find Freelancers"
            buttonLink="/hire"
          />

          {/* Section 2 */}
          <GuideSection title="Building Your Online Presence">
            <p className="mb-4">With your goals defined, it's time to build your digital storefront. This involves choosing the right platform, setting up secure payment processing, and creating essential business pages.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <InfoBox 
                title="Choosing Your Website Platform:" 
                items={platformTypes} 
              />
              
              <InfoBox 
                title="Setting Up Payment Processing:" 
                items={paymentOptions} 
              />
            </div>
          </GuideSection>
          
          {/* Section 3 */}
          <GuideSection title="Growing Your Online Business">
            <p className="mb-4">With your website up and running, it's time to attract and convert customers. This involves implementing a digital marketing plan, using analytics to improve performance, and scaling your online operations.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <InfoBox 
                title="Digital Marketing Strategies:" 
                items={marketingStrategies} 
              />
              
              <InfoBox 
                title="Analytics and Performance Improvement:" 
                items={analyticsOptions} 
              />
            </div>
          </GuideSection>
        </div>
      </div>
    </div>
  );
};

export default OfflineToOnline;
