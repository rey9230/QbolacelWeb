import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Wifi, 
  ShoppingBag, 
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Zap,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Smartphone, label: "Recargas Móvil Cubacel", to: "/recargas" },
  { icon: Wifi, label: "Recargas Nauta", to: "/recargas" },
  { icon: ShoppingBag, label: "Marketplace de Productos", to: "/marketplace" },
];

const quickLinks = [
  { label: "Inicio", to: "/" },
  { label: "Cómo Funciona", to: "/como-funciona" },
  { label: "Preguntas Frecuentes", to: "/preguntas-frecuentes" },
  { label: "Contacto", to: "/contacto" },
];

const legalLinks = [
  { label: "Términos y Condiciones", to: "/legal/terminos" },
  { label: "Política de Privacidad", to: "/legal/privacidad" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* CTA Section */}
      <div className="gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Únete a miles de personas que confían en Qbolacel para sus recargas y compras
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero-outline" size="lg" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              App Store
            </Button>
            <Button variant="hero-outline" size="lg" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              Google Play
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-xl p-2">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Qbolacel</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              La plataforma #1 para recargas móviles y envío de productos a Cuba. 
              Rápido, seguro y confiable.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon-sm" className="text-primary-foreground/70 hover:text-primary-foreground">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-primary-foreground/70 hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-primary-foreground/70 hover:text-primary-foreground">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Nuestros Servicios</h3>
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
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
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                Miami, FL, USA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Qbolacel. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
