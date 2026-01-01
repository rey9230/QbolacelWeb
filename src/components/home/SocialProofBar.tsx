import { ShieldCheck, Zap, Smartphone } from "lucide-react";

const stats = [
  { icon: Zap, label: "Recargas entregadas", value: "2M+" },
  { icon: Smartphone, label: "Usuarios activos", value: "350K+" },
  { icon: ShieldCheck, label: "Satisfacción", value: "4.9/5" },
];

export function SocialProofBar() {
  return (
    <section className="bg-primary/5 border-b border-border">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="text-center lg:text-left">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            Qbolacel Mobile First
          </p>
          <h3 className="text-xl font-semibold">
            Rápido, seguro y pensado para tus envíos y recargas a Cuba.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-3 shadow-sm"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
