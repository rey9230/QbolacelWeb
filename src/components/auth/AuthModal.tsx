import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { useRef, useState } from "react";
import { PhoneVerification } from "./PhoneVerification";

const TURNSTILE_SITE_KEY = "0x4AAAAAACH8RFaY-5kF9i74";

type ModalView = 'auth' | 'forgot-password' | 'phone-verification';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    setUser
  } = useAuthStore();
  const { toast } = useToast();

  const [view, setView] = useState<ModalView>('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Turnstile refs and tokens
  const loginTurnstileRef = useRef<TurnstileInstance>(null);
  const registerTurnstileRef = useRef<TurnstileInstance>(null);
  const forgotTurnstileRef = useRef<TurnstileInstance>(null);
  const [loginTurnstileToken, setLoginTurnstileToken] = useState<string | null>(null);
  const [registerTurnstileToken, setRegisterTurnstileToken] = useState<string | null>(null);
  const [forgotTurnstileToken, setForgotTurnstileToken] = useState<string | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [forgotEmail, setForgotEmail] = useState("");

  // Pending user data for after phone verification
  const [pendingAuth, setPendingAuth] = useState<{
    user: { id: string; email: string; name: string; avatar?: string };
    token: string;
    refreshToken: string;
    phone: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginTurnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { user, token, refreshToken } = await authApi.login({
        email: loginForm.email,
        password: loginForm.password,
        turnstileToken: loginTurnstileToken,
      });

      setUser(
        {
          id: user.id,
          email: user.email,
          name: user.userName,
          avatar: user.avatar,
          phoneVerified: user.phoneVerified,
        },
        token,
        refreshToken
      );

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      setLoginForm({ email: "", password: "" });
      setLoginTurnstileToken(null);
      loginTurnstileRef.current?.reset();
      closeAuthModal();
    } catch (error) {
      loginTurnstileRef.current?.reset();
      setLoginTurnstileToken(null);

      toast({
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Credenciales incorrectas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhone = (phone: string): boolean => {
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    return e164Regex.test(phone);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerTurnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(registerForm.phone)) {
      toast({
        title: "Teléfono inválido",
        description: "Ingresa un número de teléfono válido con código de país (ej: +5355123456)",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (!registerForm.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { user, token, refreshToken } = await authApi.register({
        userName: registerForm.name,
        phone: registerForm.phone,
        email: registerForm.email,
        password: registerForm.password,
        turnstileToken: registerTurnstileToken,
      });

      // Store pending auth — don't log in yet, require phone verification
      setPendingAuth({
        user: {
          id: user.id,
          email: user.email,
          name: user.userName,
          avatar: user.avatar
        },
        token,
        refreshToken,
        phone: registerForm.phone,
      });

      setRegisterTurnstileToken(null);
      registerTurnstileRef.current?.reset();

      // Move to phone verification
      setView('phone-verification');
    } catch (error) {
      registerTurnstileRef.current?.reset();
      setRegisterTurnstileToken(null);

      toast({
        title: "Error al crear cuenta",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerified = async () => {
    if (pendingAuth) {
      try {
        // Refresh profile to get latest phone & phoneVerified from backend
        const profile = await authApi.me();

        setUser(
          {
            id: profile.id,
            email: profile.email,
            name: profile.userName,
            avatar: profile.avatar,
            phoneVerified: profile.phoneVerified,
          },
          pendingAuth.token,
          pendingAuth.refreshToken
        );

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada y verificada correctamente",
        });
      } catch {
        // If profile fetch fails, still log in with pending auth
        setUser(pendingAuth.user, pendingAuth.token, pendingAuth.refreshToken);
      } finally {
        setPendingAuth(null);
        setRegisterForm({
          name: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        });
        closeAuthModal();
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotTurnstileToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword({
        email: forgotEmail,
        turnstileToken: forgotTurnstileToken,
      });

      toast({
        title: "Enlace enviado",
        description: "Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña",
      });

      setForgotEmail("");
      setForgotTurnstileToken(null);
      forgotTurnstileRef.current?.reset();
      setView('auth');
    } catch (error) {
      forgotTurnstileRef.current?.reset();
      setForgotTurnstileToken(null);

      toast({
        title: "Enlace enviado",
        description: "Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña",
      });

      setForgotEmail("");
      setView('auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    // While in phone verification after registration, do not allow closing
    if (!open && view === 'phone-verification' && pendingAuth) {
      toast({
        title: "Verificación requerida",
        description: "Debes verificar tu número de teléfono para activar tu cuenta.",
        variant: "destructive",
      });
      return;
    }

    if (!open) {
      closeAuthModal();
      setTimeout(() => {
        setView('auth');
        setPendingAuth(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {view === 'phone-verification' && pendingAuth ? (
          <PhoneVerification
            phone={pendingAuth.phone}
            onVerified={handlePhoneVerified}
            onBack={() => setView('auth')}
          />
        ) : view === 'auth' ? (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                {authModalTab === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
              </DialogTitle>
              <DialogDescription>
                {authModalTab === "login"
                  ? "Ingresa tus credenciales para continuar"
                  : "Regístrate para acceder a todos nuestros servicios"
                }
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={authModalTab}
              onValueChange={(v) => setAuthModalTab(v as "login" | "register")}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Ingresar</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <motion.form
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        disabled={isLoading}
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm text-muted-foreground">
                        Recordarme
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto text-sm"
                      onClick={() => setView('forgot-password')}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>

                  <div className="flex justify-center">
                    <Turnstile
                      ref={loginTurnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={setLoginTurnstileToken}
                      onError={() => setLoginTurnstileToken(null)}
                      onExpire={() => setLoginTurnstileToken(null)}
                      options={{ theme: "light", size: "normal" }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || !loginTurnstileToken}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </motion.form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <motion.form
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre"
                        className="pl-10"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Número de teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+5355123456"
                        className="pl-10"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        required
                        disabled={isLoading}
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

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        disabled={isLoading}
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
                    <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerForm.acceptTerms}
                      onCheckedChange={(checked) =>
                        setRegisterForm({ ...registerForm, acceptTerms: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                      Acepto los{" "}
                      <Button variant="link" className="px-0 h-auto text-sm">
                        términos y condiciones
                      </Button>
                      {" "}y la{" "}
                      <Button variant="link" className="px-0 h-auto text-sm">
                        política de privacidad
                      </Button>
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <Turnstile
                      ref={registerTurnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={setRegisterTurnstileToken}
                      onError={() => setRegisterTurnstileToken(null)}
                      onExpire={() => setRegisterTurnstileToken(null)}
                      options={{ theme: "light", size: "normal" }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || !registerTurnstileToken}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Forgot Password View
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Recuperar contraseña
              </DialogTitle>
              <DialogDescription>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Turnstile
                  ref={forgotTurnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setForgotTurnstileToken}
                  onError={() => setForgotTurnstileToken(null)}
                  onExpire={() => setForgotTurnstileToken(null)}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                size="lg"
                disabled={isLoading || !forgotTurnstileToken}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setView('auth')}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </form>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
