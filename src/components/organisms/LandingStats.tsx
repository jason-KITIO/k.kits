import { AnimatedSection } from "@/components/ui/animated-section";

const stats = [
  { number: "99.9%", label: "Disponibilité" },
  { number: "500+", label: "Organisations" },
  { number: "50K+", label: "Produits gérés" },
  { number: "24/7", label: "Support" },
];

export function LandingStats() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="text-center group hover:scale-110 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
