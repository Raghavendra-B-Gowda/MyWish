

interface CertificateBadgeProps {
  type?: "seal" | "academic" | "none";
  className?: string;
  size?: number;
}

export function CertificateBadge({ type = "seal", className = "", size = 96 }: CertificateBadgeProps) {
  if (type === "none") return null;

  // Swapped the image paths to fix the incorrect mapping
  const imageSrc = type === "seal" ? "/badges/academic.jpeg" : "/badges/seal.jpeg";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src={imageSrc} 
        alt={`${type} badge`} 
        style={{ width: size, height: size }}
        className="object-contain rounded-full drop-shadow-md mix-blend-multiply" 
      />
    </div>
  );
}
