import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Truck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCheckout } from "@/hooks/useCheckout";
import { toast } from "sonner";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const transactionId = searchParams.get("transaction");

  const { checkTransactionStatus } = useCheckout();
  const [isVerifying, setIsVerifying] = useState(true);
  const [transactionSku, setTransactionSku] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (transactionId) {
        try {
          const status = await checkTransactionStatus(transactionId);
          if (status.status === "COMPLETED") {
            setTransactionSku(status.transactionSku);
            toast.success("¡Pago confirmado!");
          } else if (status.status === "PROCESSING") {
            toast.info("Tu pago está siendo procesado");
          } else if (status.status === "FAILED") {
            toast.error("Hubo un problema con tu pago");
          }
        } catch (error) {
          console.error("Error verificando el pago:", error);
        }
      }
      setIsVerifying(false);
    };

    verifyPayment();
  }, [transactionId, checkTransactionStatus]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-semibold">Verificando tu pago...</h1>
            <p className="text-muted-foreground mt-2">
              Por favor espera mientras confirmamos la transacción
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex p-4 rounded-full bg-success/10 mb-6"
          >
            <CheckCircle className="h-16 w-16 text-success" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>

          {(transactionSku || orderId) && (
            <p className="text-xl text-muted-foreground mb-2">
              Orden #{transactionSku || orderId}
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            Hemos recibido tu pago correctamente. Te enviaremos un email con los detalles de tu pedido.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
            <h2 className="font-bold mb-4">Próximos pasos</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Confirmación por email</p>
                  <p className="text-sm text-muted-foreground">
                    Recibirás un email con los detalles de tu pedido
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Preparación del pedido</p>
                  <p className="text-sm text-muted-foreground">
                    El vendedor preparará tu pedido en las próximas 24-48 horas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Envío a Cuba</p>
                  <p className="text-sm text-muted-foreground">
                    Tiempo estimado de entrega: 3-5 días hábiles
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/cuenta">Ver mis pedidos</Link>
            </Button>
            <Button asChild>
              <Link to="/marketplace" className="gap-2">
                Seguir comprando
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
