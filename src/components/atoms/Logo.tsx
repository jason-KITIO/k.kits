import Image from "next/image";

interface LogoProps {
  theme?: "light" | "dark";
  size?: number;
  className?: string;
}

export function Logo({ theme = "light", size = 32, className }: LogoProps) {
  return (
    <Image
      src={theme === "dark" ? "/logo1.svg" : "/logo.svg"}
      alt="K.Kits Logo"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
