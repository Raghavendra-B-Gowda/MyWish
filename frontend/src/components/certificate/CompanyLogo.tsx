import { Building2 } from "lucide-react";
import { Logo as DefaultLogo } from "../layout/Navbar";
import { useCompanyStore } from "@/store/useCompanyStore";
interface CompanyLogoProps {
  name: string;
  className?: string;
  textColor?: string;
}

export const COMPANIES = [
  { id: 'skillzo', name: 'Skillzo', image: '/logos/skillzo_logo.png' },
  { id: 'coursa', name: 'Coursa', image: '/logos/coursa_logo.png' },
  { id: 'learnix', name: 'Learnix', image: '/logos/learnix_logo.png' },
  { id: 'edvra', name: 'Edvra', image: '/logos/edvra_logo.png' },
  { id: 'skillra', name: 'Skillra', image: '/logos/skillra_logo.png' },
  { id: 'coursio', name: 'Coursio', image: '/logos/coursio_logo.png' },
  { id: 'edvixo', name: 'Edvixo', image: '/logos/edvixo_logo.png' },
  { id: 'learnova', name: 'Learnova', image: '/logos/learnova_logo.png' },
  { id: 'velora', name: 'Velora Interns', image: '/logos/velora_interns_logo.png' },
  { id: 'clevora', name: 'Clevora Careers', image: '/logos/clevora_careers_logo.png' },
  { id: 'skillvo', name: 'Skillvo', image: '/logos/skillvo_logo.png' },
  { id: 'kursly', name: 'Kursly', image: '/logos/kursly_logo.png' },
  { id: 'virexa', name: 'Virexa Interns', image: '/logos/virexa_interns_logo.png' },
  { id: 'nexvanta', name: 'Nexvanta Labs', image: '/logos/nexvanta_labs_logo.png' },
  { id: 'averon', name: 'Averon Careers', image: '/logos/averon_careers_logo.png' },
];

export function CompanyLogo({ name, className = "", textColor = "#1e293b" }: CompanyLogoProps) {
  const dynamicCompanies = useCompanyStore(state => state.companies);

  if (name === "mywish" || !name) {
    return <div className={className}><DefaultLogo /></div>;
  }

  const company = COMPANIES.find(c => c.id === name);
  const dynamicCompany = dynamicCompanies.find(c => c.id === name);
  
  const displayCompany = company || (dynamicCompany ? { 
    id: dynamicCompany.id, 
    name: dynamicCompany.name, 
    image: dynamicCompany.logo 
  } : null);

  if (!displayCompany) {
    return <div className={className}><DefaultLogo /></div>;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {displayCompany.image ? (
        <img src={displayCompany.image} alt={displayCompany.name} className="h-24 w-auto object-contain shrink-0" />
      ) : (
        <Building2 className="w-16 h-16 shrink-0" style={{ color: textColor }} />
      )}
      <span className="font-bold text-4xl tracking-tight leading-none -mt-2" style={{ color: textColor }}>
        {displayCompany.name}
      </span>
    </div>
  );
}
