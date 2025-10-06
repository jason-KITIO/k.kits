import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordToggle } from "@/components/atoms";
import { usePasswordToggle } from "@/hooks/shared";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  required,
}: FormFieldProps) {
  const { show, toggle } = usePasswordToggle();
  const isPassword = type === "password";

  return (
    <div className="grid gap-3 relative">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={isPassword && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
      {isPassword && <PasswordToggle show={show} onToggle={toggle} disabled={disabled} />}
    </div>
  );
}
