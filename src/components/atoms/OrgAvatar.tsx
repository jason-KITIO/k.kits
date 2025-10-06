import Image from "next/image";
import { Building2 } from "lucide-react";

interface OrgAvatarProps {
  logo?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: "h-4 w-4", image: 32 },
  md: { container: "w-12 h-12", icon: "h-6 w-6", image: 48 },
  lg: { container: "w-16 h-16", icon: "h-8 w-8", image: 64 },
};

export function OrgAvatar({ logo, name, size = "md" }: OrgAvatarProps) {
  const { container, icon, image } = sizeMap[size];

  return (
    <div className={`${container} bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden`}>
      {logo ? (
        <Image src={logo} alt={name} width={image} height={image} className="object-cover rounded-xl" />
      ) : (
        <Building2 className={`${icon} text-primary`} />
      )}
    </div>
  );
}
