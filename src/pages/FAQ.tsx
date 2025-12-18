import { motion } from "framer-motion";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    title: "Recargas Móvil y Nauta",
    questions: [
      {
        question: "¿Cuánto tiempo tarda en llegar la recarga?",
        answer:
          "Las recargas son instantáneas. Tu familiar recibirá el saldo en su teléfono en cuestión de segundos después de completar el pago.",
      },
      {
        question: "¿Qué bonos están disponibles en las recargas?",
        answer:
          "Ofrecemos bonos en recargas de $10 o más. El bono varía según el monto: $10 (+$1), $15 (+$2), $20 (+$3), $25 (+$4), $30 (+$5). Los bonos pueden cambiar según promociones activas.",
      },
      {
        question: "¿Puedo recargar cualquier número cubano?",
        answer:
          "Sí, puedes recargar cualquier número Cubacel activo en Cuba. Solo necesitas el número de teléfono (5X XXX XXXX) para realizar la recarga.",
      },
      {
        question: "¿Cómo funcionan las recargas Nauta?",
        answer:
          "Las recargas Nauta añaden tiempo de navegación a la cuenta Nauta de tu familiar. Puedes elegir entre planes de 1 hora hasta 30 horas de navegación.",
      },
    ],
  },
  {
    title: "Marketplace y Envíos",
    questions: [
      {
        question: "¿Cuánto tiempo tarda la entrega de productos?",
        answer:
          "El tiempo de entrega varía según la ubicación en Cuba. Generalmente, las entregas se realizan entre 3 a 7 días hábiles después de la compra.",
      },
      {
        question: "¿Puedo hacer seguimiento de mi pedido?",
        answer:
          "Sí, una vez realizado el pedido, recibirás un número de seguimiento por email que te permitirá ver el estado de tu entrega en tiempo real.",
      },
      {
        question: "¿Qué pasa si el producto llega dañado?",
        answer:
          "Contamos con garantía de entrega. Si tu producto llega dañado, contáctanos dentro de las primeras 48 horas con fotos del daño y procesaremos un reembolso o reenvío.",
      },
      {
        question: "¿Entregan a toda Cuba?",
        answer:
          "Sí, realizamos entregas a todas las provincias de Cuba. El costo de envío puede variar según la ubicación.",
      },
    ],
  },
  {
    title: "Pagos y Seguridad",
    questions: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos PayPal, tarjetas de crédito y débito (Visa, Mastercard, American Express), y TropiPay.",
      },
      {
        question: "¿Es seguro pagar en Qbolacel?",
        answer:
          "Absolutamente. Utilizamos encriptación SSL de 256 bits y cumplimos con los estándares PCI DSS para proteger tu información financiera.",
      },
      {
        question: "¿Puedo obtener un reembolso?",
        answer:
          "Las recargas no son reembolsables una vez procesadas. Para productos del marketplace, ofrecemos reembolsos según nuestra política de devoluciones.",
      },
      {
        question: "¿Por qué mi pago fue rechazado?",
        answer:
          "Los pagos pueden ser rechazados por fondos insuficientes, datos incorrectos, o restricciones del banco. Verifica tus datos e intenta nuevamente o usa otro método de pago.",
      },
    ],
  },
  {
    title: "Cuenta y Soporte",
    questions: [
      {
        question: "¿Cómo creo una cuenta?",
        answer:
          "Puedes crear una cuenta haciendo clic en 'Ingresar' y luego 'Crear cuenta'. Solo necesitas tu email y una contraseña segura.",
      },
      {
        question: "¿Olvidé mi contraseña, qué hago?",
        answer:
          "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu email. Recibirás un enlace para restablecerla.",
      },
      {
        question: "¿Cómo puedo contactar al soporte?",
        answer:
          "Puedes contactarnos por email (soporte@qbolacel.com), teléfono (+1 727-276-0465), o chat en vivo disponible 24/7 en nuestra web.",
      },
      {
        question: "¿Tienen app móvil?",
        answer:
          "Sí, tenemos aplicaciones para Android e iOS. Puedes descargarlas desde Google Play Store y Apple App Store buscando 'Qbolacel'.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar preguntas..."
                className="pl-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No encontramos resultados para "{searchQuery}"</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Ver todas las preguntas
                </Button>
              </div>
            ) : (
              filteredCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold mb-4 text-primary">{category.title}</h2>

                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${categoryIndex}-${index}`}
                        className="bg-card border border-border rounded-xl px-4"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">¿No encontraste lo que buscabas?</h3>
          </div>
          <p className="text-muted-foreground mb-6">Nuestro equipo de soporte está listo para ayudarte</p>
          <Button asChild>
            <Link to="/contacto">Contactar Soporte</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
