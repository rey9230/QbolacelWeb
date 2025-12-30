import { useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
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

type ResetState = 'form' | 'loading' | 'success' | 'error' | 'no-token';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const { openAuthModal } = useAuthStore();
  
  const [state, setState] = useState<ResetState>(token ? 'form' : 'no-token');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setState('no-token');
      return;
    }
    
    if (!turnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setState('loading');
    
    try {
      const response = await authApi.resetPassword({
        token: token,
        newPassword: newPassword,
        turnstileToken: turnstileToken,
      });
      
      if (response.status === 'OK') {
        setState('success');
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada correctamente",
        });
      } else {
        setState('error');
      }
    } catch (error) {
      setState('error');
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar la contraseña. El enlace puede haber expirado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLogin = () => {
    navigate('/');
    // Use setTimeout to ensure navigation completes before opening modal
    setTimeout(() => {
      openAuthModal('login');
    }, 100);
  };

  const handleRequestNewLink = () => {
    navigate('/');
    // Use setTimeout to ensure navigation completes before opening modal
    setTimeout(() => {
      openAuthModal('login');
    }, 100);
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
            {state === 'form' && (
              <>
                <div className="mx-auto mb-4">
                  <KeyRound className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Nueva contraseña</CardTitle>
                <CardDescription>
                  Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
                </CardDescription>
              </>
            )}

            {state === 'loading' && (
              <>
                <div className="mx-auto mb-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <CardTitle>Actualizando contraseña</CardTitle>
                <CardDescription>
                  Por favor espera mientras actualizamos tu contraseña...
                </CardDescription>
              </>
            )}

            {state === 'success' && (
              <>
                <div className="mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-green-600">¡Contraseña actualizada!</CardTitle>
                <CardDescription>
                  Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </CardDescription>
              </>
            )}

            {state === 'error' && (
              <>
                <div className="mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Error al cambiar contraseña</CardTitle>
                <CardDescription>
                  El enlace de recuperación es inválido o ha expirado. Por favor solicita un nuevo enlace.
                </CardDescription>
              </>
            )}

            {state === 'no-token' && (
              <>
                <div className="mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Enlace inválido</CardTitle>
                <CardDescription>
                  No se proporcionó un token de recuperación válido. Por favor solicita un nuevo enlace de recuperación.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {state === 'form' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
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
                  disabled={isSubmitting || !turnstileToken}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  asChild
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al inicio
                  </Link>
                </Button>
              </form>
            )}

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

            {(state === 'error' || state === 'no-token') && (
              <div className="space-y-3">
                <Button 
                  variant="gradient" 
                  className="w-full" 
                  size="lg"
                  onClick={handleRequestNewLink}
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
