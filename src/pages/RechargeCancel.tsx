import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RechargeCancel() {
  const [searchParams] = useSearchParams();
  const rechargeId = searchParams.get("recharge");

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
            className="inline-flex p-4 rounded-full bg-destructive/10 mb-6"
          >
            <XCircle className="h-16 w-16 text-destructive" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">Recarga Cancelada</h1>

          <p className="text-muted-foreground mb-8">
            Tu recarga ha sido cancelada. No se ha realizado ningún cargo a tu cuenta.
            {rechargeId && (
              <span className="block mt-2 text-sm">
                Referencia: {rechargeId}
              </span>
            )}
          </p>

          <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
            <h2 className="font-bold mb-4">¿Necesitas ayuda?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Si tuviste problemas con el pago, intenta con otro método de pago</li>
              <li>• Asegúrate de tener fondos suficientes en tu cuenta</li>
              <li>• Verifica que los datos de tu tarjeta sean correctos</li>
              <li>• Si el problema persiste, contacta a nuestro soporte</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild>
              <Link to="/recargas" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Intentar de nuevo
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            ¿Tienes preguntas? <Link to="/contacto" className="text-primary hover:underline">Contáctanos</Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
