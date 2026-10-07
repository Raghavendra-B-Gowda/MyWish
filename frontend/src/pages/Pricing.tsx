import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "FREE",
    price: "₹0",
    description: "For trying MyWish",
    features: [
      "5 certificates",
      "Basic templates",
      "QR verification",
      "PNG download"
    ],
    buttonText: "Get Started",
    variant: "outline" as const
  },
  {
    name: "PRO",
    price: "₹299 / month",
    description: "For trainers and creators",
    features: [
      "Unlimited certificates",
      "Premium templates",
      "QR verification",
      "PDF + PNG",
      "Custom logo",
      "Custom signature",
      "Certificate sharing"
    ],
    buttonText: "Start Creating",
    variant: "default" as const,
    highlighted: true
  },
  {
    name: "ORGANIZATION",
    price: "Custom",
    description: "For colleges, companies and training institutes",
    features: [
      "Bulk certificates",
      "CSV upload",
      "Custom branding",
      "Analytics",
      "Certificate management",
      "API access"
    ],
    buttonText: "Contact Us",
    variant: "outline" as const
  }
];

export default function Pricing() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Simple pricing for every creator.</h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-3xl p-8 flex flex-col ${
                plan.highlighted 
                  ? 'border-2 border-primary shadow-xl relative transform md:-translate-y-4' 
                  : 'border border-border shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <h2 className="text-xl font-bold text-secondary mb-2">{plan.name}</h2>
              <div className="text-4xl font-extrabold text-foreground mb-4">{plan.price}</div>
              <p className="text-muted-foreground text-sm mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full"
                asChild
              >
                <Link to={plan.name === "ORGANIZATION" ? "/contact" : "/create"}>
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
