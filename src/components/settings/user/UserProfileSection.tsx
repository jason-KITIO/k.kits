"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface UserProfileSectionProps {
  profileImageUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export function UserProfileSection({ profileImageUrl, firstName, lastName }: UserProfileSectionProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profileImageUrl || "/placeholder-avatar.jpg"} />
        <AvatarFallback>
          {firstName?.[0]}{lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Changer la photo
        </Button>
        <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Max 2MB.</p>
      </div>
    </div>
  );
}
