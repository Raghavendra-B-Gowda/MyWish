import { useState } from "react";
import { SEO } from "@/components/layout/SEO";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How can I create a course completion certificate?",
    answer: "Simply click 'Create Certificate', choose the 'Course' type, select a template, fill in the student's name, course title, and organization details, and click generate. It takes less than 2 minutes."
  },
  {
    question: "How can I create an internship certificate?",
    answer: "Select the 'Internship' option in the certificate maker. You'll be able to specify the intern's role, duration, and add your company's logo. Our internship templates are specifically designed for corporate use."
  },
  {
    question: "Can I customize a certificate?",
    answer: "Yes! You can customize fonts, colors, and layouts. You can also upload your organization's logo and add digital signatures to make the certificate truly yours."
  },
  {
    question: "Can I add a certificate ID?",
    answer: "Absolutely. Every certificate generated through MyWish automatically receives a unique Certificate ID, which is printed on the certificate and encoded in the QR code."
  },
  {
    question: "Can certificates be verified online?",
    answer: "Yes, all certificates include a QR code and a unique URL. Anyone can scan the QR code or visit the verification URL to confirm the certificate's authenticity."
  },
  {
    question: "Can I download the generated certificate?",
    answer: "Yes, once generated, you can download your certificate as a high-quality PDF or image file (PNG), perfect for printing or sharing digitally."
  }
];

export function FAQ() {
  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0B0A11]">
      <SEO schema={faqSchema} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about creating and verifying certificates.</p>
        </div>
        
        <div className="w-full space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-border pb-4">
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
