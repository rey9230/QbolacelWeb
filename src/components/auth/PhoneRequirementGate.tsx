import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, LogOut, Phone as PhoneIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneVerification } from "./PhoneVerification";

// Simple E.164 validation (same as in AuthModal)
const validatePhone = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  return e164Regex.test(phone);
};

export function PhoneRequirementGate() {
  const { isAuthenticated, logout } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [step, setStep] = useState<"collect-phone" | "verify">("collect-phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state with profile
  useEffect(() => {
    if (!profile) return;

    const hasPhone = !!profile.phone && profile.phone.trim().length > 0;
    const isVerified = profile.phoneVerified === true;

    if (!hasPhone) {
      setStep("collect-phone");
      setPhoneInput("");
    } else if (!isVerified) {
      setStep("verify");
      setPhoneInput(profile.phone ?? "");
    }
  }, [profile]);

  if (!isAuthenticated) return null;

  const hasPhone = !!profile?.phone && profile.phone.trim().length > 0;
  const isVerified = profile?.phoneVerified === true;

  // If we don't have profile yet, or user is already OK, don't block
  if (!profile || isVerified || (hasPhone && isVerified)) {
    return null;
  }

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = phoneInput.trim();
    if (!validatePhone(trimmed)) {
      toast({
        title: "Teléfono inválido",
        description: "Ingresa un número de teléfono válido con código de país (ej: +5355123456)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    updateProfile.mutate(
      { phone: trimmed },
      {
        onSuccess: () => {
          toast({
            title: "Teléfono actualizado",
            description: "Ahora debes verificar tu número para continuar",
          });
          setStep("verify");
        },
        onError: (error) => {
          toast({
            title: "Error al guardar teléfono",
            description: error.message,
            variant: "destructive",
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleVerified = () => {
    toast({
      title: "¡Teléfono verificado!",
      description: "Tu número ha sido verificado correctamente",
    });
  };

  const loading = isLoading || isSubmitting;

  // Always open; user cannot close without completar o cerrar sesión
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="border-none shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7 text-primary" />
            </div>
            <CardTitle>Completa la seguridad de tu cuenta</CardTitle>
            <CardDescription>
              Debes tener un número de teléfono válido y verificado para usar la plataforma.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && step === "collect-phone" && (
              <form onSubmit={handleSavePhone} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gate-phone">Número de teléfono</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gate-phone"
                      type="tel"
                      className="pl-10"
                      placeholder="+5355123456"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye el código de país (ej: +53 para Cuba).
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Al proporcionar tu número, aceptas recibir un SMS de un solo uso para fines de verificación.
                    Pueden aplicarse tarifas de mensajes y datos según tu operador.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar y continuar"
                  )}
                </Button>
              </form>
            )}

            {!loading && step === "verify" && hasPhone && (
              <div className="space-y-4">
                <PhoneVerification
                  phone={profile.phone!}
                  onVerified={handleVerified}
                  onBack={logout}
                />
              </div>
            )}

            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 text-muted-foreground"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
