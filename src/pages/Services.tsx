import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Car, Plane, FileText, Banknote, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import slide1Desktop from "@/assets/hero/slide1-desktop.jpg";
import slide2Desktop from "@/assets/hero/slide2-desktop.jpg";
import slide3Desktop from "@/assets/hero/slide3-desktop.jpg";
import slide4Desktop from "@/assets/hero/slide4-desktop.jpg";

const services = [
  {
    title: "Renta de autos",
    description: "Flota curada y entrega coordinada. Te ayudamos a elegir y reservar sin fricciones.",
    icon: Car,
    message: "Hola, quiero información sobre renta de autos en Cuba.",
    perks: ["Coordinación y confirmación", "Soporte personalizado", "Opciones flexibles"],
    image: slide1Desktop,
  },
  {
    title: "Boletos aéreos",
    description: "Cotizamos y emitimos tus vuelos con asistencia humana. Tarifas claras y tiempos confirmados.",
    icon: Plane,
    message: "Hola, necesito cotizar boletos aéreos.",
    perks: ["Búsqueda guiada", "Emisión segura", "Cambios y soporte"],
    image: slide2Desktop,
  },
  {
    title: "Trámites legales y pasaporte",
    description: "Acompañamiento en procesos migratorios y de pasaporte. Menos filas, más claridad.",
    icon: FileText,
    message: "Hola, requiero ayuda con trámites legales/pasaporte.",
    perks: ["Checklist simple", "Documentación guiada", "Seguimiento de estado"],
    image: slide3Desktop,
  },
  {
    title: "Envío de remesas",
    description: "Alternativas seguras para enviar dinero a Cuba. Transparencia y rapidez.",
    icon: Banknote,
    message: "Hola, quiero información para enviar remesas.",
    perks: ["Opciones seguras", "Tiempos claros", "Asistencia directa"],
    image: slide4Desktop,
  },
];

const whatsappNumber = "17272760465";

function buildWhatsAppLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const steps = [
  {
    title: "Cuéntanos tu necesidad",
    detail: "Envíanos los datos clave y el servicio deseado.",
  },
  {
    title: "Te guiamos con opciones",
    detail: "Preseleccionamos opciones y confirmamos disponibilidad.",
  },
  {
    title: "Cerramos por ti",
    detail: "Coordinamos reservas, pagos y seguimiento.",
  },
];

const highlights = [
  "Atención humana y rápida",
  "Transparencia en tiempos y costos",
  "Experiencia mobile-first con Qbolacel",
];

const accentLink = "https://play.google.com/store/apps/details?id=com.qbolacel.app";

export default function Services() {
  useDocumentMeta({
    title: "Servicios Premium - Qbolacel",
    description: "Renta de autos, boletos aéreos, trámites y remesas con atención personalizada. Solicita y coordinamos por ti.",
    ogType: "website",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-14 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">Servicios premium</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Soluciones para viajar, gestionar y enviar con apoyo experto.
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Renta de autos, boletos aéreos, trámites y remesas. Te acompañamos con tiempos claros y respuesta ágil.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={buildWhatsAppLink("Hola, quiero hablar sobre servicios premium de Qbolacel.")} target="_blank" rel="noreferrer">
                  Solicitar ahora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" asChild className="gap-2">
                <a href={accentLink} target="_blank" rel="noreferrer">
                  App Android
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-2 rounded-full shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-3xl" />
            <div className="relative bg-white border border-border rounded-3xl p-6 shadow-xl space-y-4">
              <p className="text-sm font-semibold text-primary">Cómo funciona</p>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-3 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            <div className="pt-2">
              <Button asChild className="w-full">
                <a href={buildWhatsAppLink("Hola, quiero empezar con un servicio premium de Qbolacel.")} target="_blank" rel="noreferrer">
                  Iniciar chat
                </a>
              </Button>
            </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border">
              <img src={slide4Desktop} alt="Servicios Qbolacel" className="w-full h-60 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-14 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <p className="text-primary font-semibold">Servicios</p>
            <h2 className="text-3xl font-bold">Elige lo que necesitas</h2>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Te conectamos con la mejor opción y te mantenemos informado. Un solo canal, múltiples soluciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="rounded-3xl border border-border shadow-sm overflow-hidden bg-white"
              >
                <div className="relative h-40">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    <Icon className="h-4 w-4" />
                    {service.title}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.perks.map((perk) => (
                      <div key={perk} className="inline-flex items-center gap-2 text-sm text-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        {perk}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button asChild className="gap-2">
                      <a href={buildWhatsAppLink(service.message)} target="_blank" rel="noreferrer">
                        Solicitar por WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/marketplace">Ver productos relacionados</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Outro */}
      <section className="py-12 container mx-auto px-4">
        <div className="bg-white border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-primary font-semibold">En manos expertas</p>
            <h3 className="text-2xl font-bold">Coordinamos por ti, de inicio a fin.</h3>
            <p className="text-muted-foreground max-w-2xl">
              Escríbenos y te respondemos con la mejor ruta en minutos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={buildWhatsAppLink("Hola, quiero coordinar un servicio ahora.")} target="_blank" rel="noreferrer">
                Hablar ahora
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={accentLink} target="_blank" rel="noreferrer">
                Ver App Android
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
