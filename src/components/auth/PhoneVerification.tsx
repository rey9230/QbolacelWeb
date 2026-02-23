import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Phone, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { otpApi } from "@/lib/api";

const TURNSTILE_SITE_KEY = "0x4AAAAAACH8RFaY-5kF9i74";
const COOLDOWN_SECONDS = 60;
const EXPIRY_SECONDS = 300;

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export function PhoneVerification({ phone, onVerified, onBack }: PhoneVerificationProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  
  // Cooldown state
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval>>();
  
  // Expiry state
  const [expiryTime, setExpiryTime] = useState(0);
  const expiryRef = useRef<ReturnType<typeof setInterval>>();
  
  // Turnstile
  const sendTurnstileRef = useRef<TurnstileInstance>(null);
  const verifyTurnstileRef = useRef<TurnstileInstance>(null);
  const [sendTurnstileToken, setSendTurnstileToken] = useState<string | null>(null);
  const [verifyTurnstileToken, setVerifyTurnstileToken] = useState<string | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      if (expiryRef.current) clearInterval(expiryRef.current);
    };
  }, []);

  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startExpiry = useCallback((seconds: number) => {
    setExpiryTime(seconds);
    if (expiryRef.current) clearInterval(expiryRef.current);
    expiryRef.current = setInterval(() => {
      setExpiryTime(prev => {
        if (prev <= 1) {
          clearInterval(expiryRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendOtp = async () => {
    if (!sendTurnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await otpApi.sendOtp({
        phone,
        turnstileToken: sendTurnstileToken,
      });

      if (response.success) {
        toast({
          title: "Código enviado",
          description: `Hemos enviado un código SMS al ${phone}`,
        });
        startCooldown(response.cooldownSeconds || COOLDOWN_SECONDS);
        startExpiry(response.expiresInSeconds || EXPIRY_SECONDS);
        setStep('verify');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo enviar el código";
      
      // Handle specific error cases
      if (message.includes("429") || message.includes("Demasiados") || message.includes("Rate")) {
        toast({
          title: "Demasiados intentos",
          description: "Has excedido el límite de envíos. Espera un momento antes de intentar de nuevo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al enviar código",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      sendTurnstileRef.current?.reset();
      setSendTurnstileToken(null);
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verifyTurnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    if (otpCode.length !== 6) {
      toast({
        title: "Código incompleto",
        description: "Ingresa los 6 dígitos del código",
        variant: "destructive",
      });
      return;
    }

    if (expiryTime <= 0) {
      toast({
        title: "Código expirado",
        description: "El código ha expirado. Solicita uno nuevo.",
        variant: "destructive",
      });
      setStep('send');
      setOtpCode("");
      return;
    }

    setIsLoading(true);
    try {
      const response = await otpApi.verifyOtp({
        phone,
        code: otpCode,
        turnstileToken: verifyTurnstileToken,
      });

      if (response.success && response.phoneVerified) {
        toast({
          title: "¡Teléfono verificado!",
          description: "Tu número de teléfono ha sido verificado correctamente",
        });
        onVerified();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Código incorrecto";
      toast({
        title: "Error de verificación",
        description: message,
        variant: "destructive",
      });
      setOtpCode("");
    } finally {
      verifyTurnstileRef.current?.reset();
      setVerifyTurnstileToken(null);
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setStep('send');
    setOtpCode("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Verifica tu teléfono</h3>
        <p className="text-sm text-muted-foreground">
          {step === 'send' 
            ? `Enviaremos un código de verificación al número ${phone}`
            : `Ingresa el código de 6 dígitos enviado al ${phone}`
          }
        </p>
      </div>

      {step === 'send' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{phone}</span>
          </div>

          <div className="flex justify-center">
            <Turnstile
              ref={sendTurnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={setSendTurnstileToken}
              onError={() => setSendTurnstileToken(null)}
              onExpire={() => setSendTurnstileToken(null)}
              options={{ theme: "light", size: "normal" }}
            />
          </div>

          <Button
            variant="gradient"
            className="w-full"
            size="lg"
            onClick={handleSendOtp}
            disabled={isLoading || !sendTurnstileToken || cooldown > 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : cooldown > 0 ? (
              `Reenviar en ${cooldown}s`
            ) : (
              "Enviar código SMS"
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <span className="mx-2 text-muted-foreground">-</span>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer */}
          {expiryTime > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              El código expira en <span className="font-medium text-foreground">{formatTime(expiryTime)}</span>
            </p>
          )}
          {expiryTime <= 0 && step === 'verify' && (
            <p className="text-center text-sm text-destructive font-medium">
              El código ha expirado
            </p>
          )}

          <div className="flex justify-center">
            <Turnstile
              ref={verifyTurnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={setVerifyTurnstileToken}
              onError={() => setVerifyTurnstileToken(null)}
              onExpire={() => setVerifyTurnstileToken(null)}
              options={{ theme: "light", size: "normal" }}
            />
          </div>

          <Button
            variant="gradient"
            className="w-full"
            size="lg"
            onClick={handleVerifyOtp}
            disabled={isLoading || !verifyTurnstileToken || otpCode.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar código"
            )}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={handleResendCode}
              disabled={cooldown > 0 || isLoading}
            >
              {cooldown > 0 
                ? `Reenviar código en ${cooldown}s` 
                : "¿No recibiste el código? Reenviar"
              }
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      )}
    </motion.div>
  );
}
