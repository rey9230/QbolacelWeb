import { Button } from "@/components/ui/button";
import { Car, Plane, FileText, Banknote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Renta de autos",
    description: "Reserva autos con entrega coordinada y soporte dedicado.",
    icon: Car,
    message: "Hola, quiero información sobre renta de autos en Cuba.",
  },
  {
    title: "Boletos aéreos",
    description: "Cotiza y emite boletos con asesoría experta.",
    icon: Plane,
    message: "Hola, necesito cotizar boletos aéreos.",
  },
  {
    title: "Trámites legales y pasaporte",
    description: "Acompañamiento en procesos migratorios y pasaporte.",
    icon: FileText,
    message: "Hola, requiero ayuda con trámites legales/pasaporte.",
  },
  {
    title: "Envío de remesas",
    description: "Alternativas seguras para enviar dinero a Cuba.",
    icon: Banknote,
    message: "Hola, quiero información para enviar remesas.",
  },
];

export function AgencyServicesSection() {
  return (
    <section className="py-14 bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-primary font-semibold">Servicios destacados</p>
            <h2 className="text-3xl font-bold">Soluciones premium para tu familia en Cuba</h2>
            <p className="text-muted-foreground max-w-2xl">
              Gestión a medida para viajes, trámites y remesas. Un solo contacto, respuesta rápida.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Atención personalizada y rápida
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="border border-border rounded-2xl p-4 bg-card shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{service.description}</p>
                <Button asChild className="w-full gap-2">
                  <Link to="/servicios">
                    Ver detalle
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
