import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

const TURNSTILE_SITE_KEY = "0x4AAAAAACH8RFaY-5kF9i74";

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab,
    setUser 
  } = useAuthStore();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Turnstile refs and tokens
  const loginTurnstileRef = useRef<TurnstileInstance>(null);
  const registerTurnstileRef = useRef<TurnstileInstance>(null);
  const [loginTurnstileToken, setLoginTurnstileToken] = useState<string | null>(null);
  const [registerTurnstileToken, setRegisterTurnstileToken] = useState<string | null>(null);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

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
          avatar: user.avatar 
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
      // Reset turnstile on error
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
        email: registerForm.email,
        password: registerForm.password,
        turnstileToken: registerTurnstileToken,
      });
      
      setUser(
        { 
          id: user.id, 
          email: user.email, 
          name: user.userName,
          avatar: user.avatar 
        },
        token,
        refreshToken
      );
      
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada correctamente",
      });
      
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });
      setRegisterTurnstileToken(null);
      registerTurnstileRef.current?.reset();
      closeAuthModal();
    } catch (error) {
      // Reset turnstile on error
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

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
                <Button variant="link" className="px-0 h-auto text-sm">
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>

              {/* Turnstile widget for login */}
              <div className="flex justify-center">
                <Turnstile
                  ref={loginTurnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setLoginTurnstileToken}
                  onError={() => setLoginTurnstileToken(null)}
                  onExpire={() => setLoginTurnstileToken(null)}
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

              {/* Turnstile widget for register */}
              <div className="flex justify-center">
                <Turnstile
                  ref={registerTurnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setRegisterTurnstileToken}
                  onError={() => setRegisterTurnstileToken(null)}
                  onExpire={() => setRegisterTurnstileToken(null)}
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
      </DialogContent>
    </Dialog>
  );
}
