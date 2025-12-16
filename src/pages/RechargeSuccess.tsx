import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCheckout } from "@/hooks/useCheckout";
import { toast } from "sonner";

export default function RechargeSuccess() {
  const [searchParams] = useSearchParams();
  const rechargeId = searchParams.get("recharge");
  const transactionId = searchParams.get("transaction");

  const { checkTransactionStatus } = useCheckout();
  const [isVerifying, setIsVerifying] = useState(true);
  const [transactionSku, setTransactionSku] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (transactionId) {
        try {
          const status = await checkTransactionStatus(transactionId);
          if (status.status === "COMPLETED") {
            setTransactionSku(status.transactionSku);
            setAmount(status.amount);
            toast.success("¡Recarga confirmada!");
          } else if (status.status === "PROCESSING") {
            toast.info("Tu recarga está siendo procesada");
          } else if (status.status === "FAILED") {
            toast.error("Hubo un problema con tu recarga");
          }
        } catch (error) {
          console.error("Error verificando la recarga:", error);
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
            <h1 className="text-xl font-semibold">Verificando tu recarga...</h1>
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

          <h1 className="text-3xl font-bold mb-4">¡Recarga Exitosa!</h1>

          {transactionSku && (
            <p className="text-xl text-muted-foreground mb-2">
              Transacción #{transactionSku}
            </p>
          )}

          {amount && (
            <p className="text-lg text-muted-foreground mb-4">
              Monto recargado: <span className="font-bold text-success">${amount}</span>
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            El saldo ha sido enviado correctamente. En unos segundos debería aparecer en el teléfono de destino.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              ¿Qué sigue?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Entrega instantánea</p>
                  <p className="text-sm text-muted-foreground">
                    El saldo debería aparecer en segundos. Si no lo ves después de 5 minutos, contáctanos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Confirmación por SMS</p>
                  <p className="text-sm text-muted-foreground">
                    El destinatario recibirá un SMS de ETECSA confirmando la recarga.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/cuenta">Ver historial</Link>
            </Button>
            <Button asChild>
              <Link to="/recargas" className="gap-2">
                Hacer otra recarga
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
