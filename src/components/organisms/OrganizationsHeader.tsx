import { Button } from "@/components/ui/button";
import { Grid3X3, List, Plus } from "lucide-react";
import Link from "next/link";

interface OrganizationsHeaderProps {
  count: number;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

export function OrganizationsHeader({ count, viewMode, onViewModeChange }: OrganizationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Mes organisations</h1>
        <p className="text-muted-foreground mt-1">
          Gérez et accédez à vos {count} organisation{count > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("cards")}
            className="h-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="h-8"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild>
          <Link href="/preferences/organizations/create">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle organisation
          </Link>
        </Button>
      </div>
    </div>
  );
}
