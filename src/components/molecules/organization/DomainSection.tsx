"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface DomainSectionProps {
  domain: string;
  onDomainChange: (value: string) => void;
  disabled?: boolean;
}

export function DomainSection({ domain, onDomainChange, disabled }: DomainSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domaine web
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="domain">Sous-domaine</Label>
          <div className="flex items-center">
            <Input id="domain" placeholder="mon-entreprise" value={domain} onChange={(e) => onDomainChange(e.target.value)} disabled={disabled} className="rounded-r-none" />
            <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">.kkits.com</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
