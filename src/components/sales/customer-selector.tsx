"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email?: string;
}

interface CustomerSelectorProps {
  organizationId: string;
  storeId: string;
  customers?: Customer[];
  value: string;
  onChange: (value: string) => void;
}

export function CustomerSelector({ organizationId, storeId, customers, value, onChange }: CustomerSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Qui achète ? (optionnel)</Label>
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/customers/new`}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Link>
        </Button>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un client ou laisser vide" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__no_customer__">Client de passage (anonyme)</SelectItem>
          {customers?.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} {customer.email && `(${customer.email})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}