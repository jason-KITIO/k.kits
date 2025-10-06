import { Eye, EyeClosed } from "@solar-icons/react";
import { Button } from "@/components/ui/button";

interface PasswordToggleProps {
  show: boolean;
  onToggle: () => void;
  className?: string;
  disabled?: boolean;
}

export function PasswordToggle({ show, onToggle, className, disabled }: PasswordToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      disabled={disabled}
      className={className || "absolute right-3 top-10"}
    >
      {show ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
}
