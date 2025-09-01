"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export function OnboardingForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  function handleSubmit() {
    router.push("/onboarding/telephone");
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Commencez votre nouvelle aventure
          </CardTitle>
          <CardDescription>Quelques éléments à examiner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <Label
                  className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 
                  has-[[aria-checked=true]]:border-primary 
                  has-[[aria-checked=true]]:bg-primary/10 
                  dark:has-[[aria-checked=true]]:border-primary-dark 
                  dark:has-[[aria-checked=true]]:bg-primary-dark/20"
                >
                  <Checkbox
                    id="toggle-2"
                    defaultChecked
                    className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white 
               dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium text-foreground">
                      Recevoir les mises à jour par email
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Soyez informé en avant-première des nouveautés et
                      améliorations de K.kits.
                    </p>
                  </div>
                </Label>

                <Label
                  className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 
                  has-[[aria-checked=true]]:border-primary 
                  has-[[aria-checked=true]]:bg-primary/10 
                  dark:has-[[aria-checked=true]]:border-primary-dark 
                  dark:has-[[aria-checked=true]]:bg-primary-dark/20"
                >
                  <Checkbox
                    id="toggle-3"
                    defaultChecked
                    className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white 
               dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium text-foreground">
                      J&apos;accepte les conditions d&apos;utilisation
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Vous devez accepter nos conditions pour créer un compte.
                    </p>
                  </div>
                </Label>
                <Button type="submit" className="w-full">
                  Continuer
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
