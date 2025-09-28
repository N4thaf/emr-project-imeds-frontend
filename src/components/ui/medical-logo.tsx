import medicalCrossLogo from "@/assets/medical-cross-logo.png";

interface MedicalLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MedicalLogo = ({ size = "md", className = "" }: MedicalLogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <img 
      src={medicalCrossLogo} 
      alt="Medical Cross Logo" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};