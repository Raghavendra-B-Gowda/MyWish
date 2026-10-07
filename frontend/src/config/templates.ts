export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  style?: string;
  defaultColors?: {
    certificateColor: string;
    accentColor: string;
    textColor: string;
  };
  defaultFont?: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "geometric-blocks",
    name: "Geometric Blocks",
    category: "Participation",
    description: "Structured block design.",
    image: "/templates/geometric-blocks.png",
    defaultColors: { certificateColor: "#FAFAFA", accentColor: "#3182CE", textColor: "#2D3748" },
    defaultFont: "Inter"
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    category: "Course",
    description: "A sleek, modern design with a blue accent.",
    image: "/templates/modern-blue.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#1769E0", textColor: "#0B1F3A" },
    defaultFont: "Inter"
  },
  {
    id: "premium-gold",
    name: "Premium Gold",
    category: "Achievement",
    description: "Elegant gold borders for a premium feel.",
    image: "/templates/premium-gold.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#D4AF37", textColor: "#1C1C1C" },
    defaultFont: "Playfair Display"
  },
  {
    id: "internship",
    name: "Internship Certificate",
    category: "Internship",
    description: "Professional design for internship completion.",
    image: "/templates/internship.png",
    defaultColors: { certificateColor: "#F8F9FA", accentColor: "#2C3E50", textColor: "#1A1A1A" },
    defaultFont: "Roboto Mono"
  },
  {
    id: "minimal",
    name: "Minimalist",
    category: "Completion",
    description: "Clean and minimal design.",
    image: "/templates/minimal.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#333333", textColor: "#000000" },
    defaultFont: "Inter"
  },
  {
    id: "tech-innovator",
    name: "Tech Innovator",
    category: "Course",
    description: "Futuristic tech-inspired design.",
    image: "/templates/tech-innovator.png",
    defaultColors: { certificateColor: "#F8FAFC", accentColor: "#059669", textColor: "#0F172A" },
    defaultFont: "Outfit"
  },
  {
    id: "academic-classic",
    name: "Academic Classic",
    category: "Course",
    description: "Traditional academic style.",
    image: "/templates/academic-classic.png",
    defaultColors: { certificateColor: "#F4F1EA", accentColor: "#800000", textColor: "#2C1810" },
    defaultFont: "Merriweather"
  },
  {
    id: "corporate-modern",
    name: "Corporate Modern",
    category: "Corporate",
    description: "Clean corporate aesthetic.",
    image: "/templates/corporate-modern.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#0052CC", textColor: "#172B4D" },
    defaultFont: "Montserrat"
  },
  {
    id: "geometric-pulse",
    name: "Geometric Pulse",
    category: "Achievement",
    description: "Vibrant geometric shapes.",
    image: "/templates/geometric-pulse.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#FF3366", textColor: "#2D3748" },
    defaultFont: "Inter"
  },
  {
    id: "geometric-orbit",
    name: "Geometric Orbit",
    category: "Completion",
    description: "Circular geometric accents.",
    image: "/templates/geometric-orbit.png",
    defaultColors: { certificateColor: "#FFFFFF", accentColor: "#6B46C1", textColor: "#1A202C" },
    defaultFont: "Outfit"
  }
];

export const CATEGORIES = ["All", "Course", "Internship", "Completion", "Achievement", "Participation", "Appreciation", "Corporate"];

