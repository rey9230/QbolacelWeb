import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import logoVertical from "@/assets/logo-vertical.svg";

const TURNSTILE_SITE_KEY = "0x4AAAAAACH8RFaY-5kF9i74";

type VerifyState = 'loading' | 'success' | 'error' | 'resend';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const { openAuthModal } = useAuthStore();
  
  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'error');
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    if (!token) {
      setState('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        if (response.status === 'OK') {
          setState('success');
        } else {
          setState('error');
        }
      } catch {
        setState('error');
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }
    
    setIsResending(true);
    
    try {
      await authApi.resendVerification({
        email: resendEmail,
        turnstileToken: turnstileToken,
      });
      
      toast({
        title: "Correo enviado",
        description: "Si el email existe en nuestro sistema, recibirás un nuevo enlace de verificación",
      });
      
      setResendEmail("");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch {
      toast({
        title: "Correo enviado",
        description: "Si el email existe en nuestro sistema, recibirás un nuevo enlace de verificación",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenLogin = () => {
    openAuthModal('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logoVertical} alt="QbolaCel" className="h-16" />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            {state === 'loading' && (
              <>
                <div className="mx-auto mb-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <CardTitle>Verificando tu email</CardTitle>
                <CardDescription>
                  Por favor espera mientras verificamos tu correo electrónico...
                </CardDescription>
              </>
            )}

            {state === 'success' && (
              <>
                <div className="mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-green-600">¡Email verificado!</CardTitle>
                <CardDescription>
                  Tu correo electrónico ha sido verificado correctamente. Ya puedes iniciar sesión en tu cuenta.
                </CardDescription>
              </>
            )}

            {state === 'error' && (
              <>
                <div className="mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Error de verificación</CardTitle>
                <CardDescription>
                  {!token 
                    ? "No se proporcionó un token de verificación válido."
                    : "El enlace de verificación es inválido o ha expirado."
                  }
                </CardDescription>
              </>
            )}

            {state === 'resend' && (
              <>
                <div className="mx-auto mb-4">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Reenviar verificación</CardTitle>
                <CardDescription>
                  Ingresa tu correo electrónico para recibir un nuevo enlace de verificación
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {state === 'success' && (
              <Button 
                variant="gradient" 
                className="w-full" 
                size="lg"
                onClick={handleOpenLogin}
              >
                Iniciar Sesión
              </Button>
            )}

            {state === 'error' && (
              <div className="space-y-3">
                <Button 
                  variant="gradient" 
                  className="w-full" 
                  size="lg"
                  onClick={() => setState('resend')}
                >
                  Solicitar nuevo enlace
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            )}

            {state === 'resend' && (
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resend-email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      disabled={isResending}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => setTurnstileToken(null)}
                    options={{
                      theme: "light",
                      size: "normal",
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="w-full" 
                  size="lg"
                  disabled={isResending || !turnstileToken}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace"
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setState('error')}
                  disabled={isResending}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
