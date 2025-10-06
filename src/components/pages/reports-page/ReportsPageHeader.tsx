import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReportsPageHeaderProps {
  organizationId: string;
}

export function ReportsPageHeader({ organizationId }: ReportsPageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/preferences/organizations/${organizationId}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Rapports</h1>
        <p className="text-muted-foreground">Analysez les performances de votre organisation</p>
      </div>
    </div>
  );
}
