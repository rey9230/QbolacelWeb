import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import playBadge from "@/assets/stores/google-play-badge.svg";

export function AppDownloadSection() {
  return (
    <section className="py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="text-primary font-semibold">App Android disponible</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Qbolacel es mobile first. Todo desde tu teléfono.
          </h2>
          <p className="text-muted-foreground text-lg">
            Recargas Cubacel y Nauta, compras en el marketplace y pagos 1‑clic.
            Protección de pagos, historial unificado y soporte 24/7.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.qbolacel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <img
                src={playBadge}
                alt="Disponible en Google Play"
                className="h-12"
              />
            </a>
            <Button variant="outline" disabled className="gap-2">
              App Store (próximamente)
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Pagos cifrados y guardado seguro de tarjetas</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Bonos y promociones exclusivas en la app</span>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-3xl p-6 shadow-xl space-y-4">
          <p className="text-sm font-semibold text-primary">Modo App</p>
          <h3 className="text-2xl font-bold">Experiencia optimizada en móvil</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary mt-1" />
              Recarga en 30 segundos con autocomplete de contactos.
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary mt-1" />
              Checkout unificado: TropiPay, PayPal, Stripe y guardado de método.
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary mt-1" />
              Seguimiento de pedidos del marketplace y soporte en vivo.
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary mt-1" />
              Multivendedor: compra a tiendas verificadas en toda Cuba.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
