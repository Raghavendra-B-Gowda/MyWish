import { LandingPageTemplate } from "./LandingPageTemplate";
import { Award, ShieldCheck, PenTool } from "lucide-react";

export default function GeneralCertificateMaker() {
  const seo = {
    title: "Certificate Maker | Create Professional Certificates Online | MyWish",
    description: "Use MyWish Certificate Maker to create professional, verifiable certificates online. Choose from multiple templates for courses, internships, and training programs.",
    canonicalUrl: "/certificate-maker",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MyWish Certificate Maker",
      "applicationCategory": "BusinessApplication",
      "description": "Create professional certificates online.",
      "operatingSystem": "All"
    }
  };

  const hero = {
    badge: "Professional Certificate Maker",
    headline: <>Create <span className="text-primary">Stunning Certificates</span> for Any Occasion</>,
    subheadline: "Whether you're recognizing course completion, internship participation, or skill development, MyWish provides the tools to generate verifiable, beautiful certificates instantly.",
    ctaText: "Start Creating Now",
    imageAlt: "Certificate Maker Dashboard Preview"
  };

  const features = [
    {
      title: "Multiple Templates",
      description: "Browse our collection of modern, professional templates suited for both academic and corporate environments.",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Secure Verification",
      description: "Ensure authenticity with auto-generated unique Certificate IDs and scannable QR codes on every certificate.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Easy Customization",
      description: "Intuitive form interface allows you to add participant details, logos, signatures, and descriptions without any design skills.",
      icon: <PenTool className="w-6 h-6" />
    }
  ];

  const benefits = [
    "Ideal for educational institutes, corporations, and independent trainers.",
    "No complex design software needed - fill the form and generate.",
    "Export to high-quality PDF instantly.",
    "100% free to use for legitimate educational and professional recognition.",
    "Mobile-optimized interface lets you create certificates on the go."
  ];

  return <LandingPageTemplate seo={seo} hero={hero} features={features} benefits={benefits} />;
}
