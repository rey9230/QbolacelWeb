import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo recargo un número Cubacel desde Qbolacel?",
    answer: "Selecciona Recargas, elige Cubacel, coloca el número, selecciona el monto y paga con TropiPay, PayPal o tarjeta. Entrega instantánea.",
  },
  {
    question: "¿Puedo comprar en el marketplace y enviar a Cuba?",
    answer: "Sí. Elige provincia/municipio, añade productos al carrito y paga con el mismo checkout unificado. Entregas a domicilio en toda Cuba.",
  },
  {
    question: "¿Qué es el pago 1‑clic?",
    answer: "Guardas tu método de pago y en la próxima compra confirmas sin volver a introducir datos. Seguro y cifrado.",
  },
  {
    question: "¿Tienen soporte 24/7?",
    answer: "Sí, soporte por correo y chat. Notificamos el estado de cada recarga y pedido.",
  },
];

export function FAQEducationSection() {
  return (
    <section className="py-14 bg-muted/50">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-3">
          <p className="text-primary font-semibold">Aprende en 2 minutos</p>
          <h2 className="text-3xl font-bold">Cómo recargar y comprar en Qbolacel</h2>
          <p className="text-muted-foreground">
            Integramos recargas y marketplace en un solo checkout. Sin comisiones ocultas, entrega rápida y con respaldo de tiendas verificadas.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, index) => (
            <AccordionItem value={`faq-${index}`} key={item.question}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
