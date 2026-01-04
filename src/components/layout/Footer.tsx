import logoVertical from "@/assets/logo-vertical-dark.svg";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Mail, MapPin, Phone, ShoppingBag, Smartphone, Twitter, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Smartphone, label: "Recargas Móvil Cubacel", to: "/recargas" },
  { icon: Wifi, label: "Recargas Nauta", to: "/recargas" },
  { icon: ShoppingBag, label: "Marketplace", to: "/marketplace" },
];

const quickLinks = [
  { label: "Inicio", to: "/" },
  { label: "Recargas", to: "/recargas" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Sobre Nosotros", to: "/sobre-nosotros" },
  { label: "Preguntas Frecuentes", to: "/preguntas-frecuentes" },
  { label: "Contacto", to: "/contacto" },
];

const legalLinks = [
  { label: "Términos y Condiciones", to: "/terminos" },
  { label: "Política de Privacidad", to: "/privacidad" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground pb-20 md:pb-0">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img src={logoVertical} alt="Qbolacel" className="h-20" />
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              La plataforma #1 para recargas móviles y envío de productos a Cuba. Rápido, seguro y confiable.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground h-9 w-9"
                asChild
              >
                <a href="https://facebook.com/qbolacel" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground h-9 w-9"
                asChild
              >
                <a href="https://instagram.com/qbolacel" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground h-9 w-9"
                asChild
              >
                <a href="https://twitter.com/qbolacel" target="_blank" rel="noreferrer" aria-label="X">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.to}
                    className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    <service.icon className="h-4 w-4" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Downloads */}
            <div className="mt-6">
              <h4 className="font-medium mb-3 text-sm">Descarga la App</h4>
              <div className="flex gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.qbolacel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary-foreground/10 text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary-foreground/20 transition-colors"
                >
                  Google Play
                </a>
                <a
                  aria-disabled="true"
                  className="bg-primary-foreground/5 text-primary-foreground/60 px-3 py-2 rounded-lg text-xs font-medium cursor-not-allowed"
                >
                  App Store (próx.)
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                soporte@qbolacel.com
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                +1 (727) 276-0465
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                Saint Petersburg, FL, USA
              </li>
            </ul>

            {/* Legal */}
            <div className="mt-6">
              <h4 className="font-medium mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Qbolacel LLC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
