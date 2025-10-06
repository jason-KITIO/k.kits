"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onChange: (field: string, value: string) => void;
}

export function UserInfoForm({ firstName, lastName, email, phone, onChange }: UserInfoFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">Prénom</Label>
          <Input
            id="first-name"
            placeholder="Jason"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Nom</Label>
          <Input
            id="last-name"
            placeholder="Kitio"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jason@example.com"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          placeholder="+33 6 12 34 56 78"
          value={phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
    </div>
  );
}
