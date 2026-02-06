import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Shield, Sparkles, Check } from "lucide-react";
import logoImage from "@/assets/tamv-logo-oficial.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    if (!email || !password) {
      toast({ title: "Error", description: "Email y contraseña son requeridos", variant: "destructive" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Error", description: "Email inválido", variant: "destructive" });
      return false;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return false;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
        return false;
      }
      if (!fullName.trim()) {
        toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
        return false;
      }
      if (!acceptTerms) {
        toast({ title: "Error", description: "Debes aceptar los términos", variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Credenciales inválidas. Verifica tu email y contraseña.");
          }
          throw error;
        }
        
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Has iniciado sesión exitosamente.",
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName.trim(),
              username: username.trim() || undefined,
            },
          },
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Este email ya está registrado. Intenta iniciar sesión.");
          }
          throw error;
        }

        if (data.user && !data.session) {
          toast({
            title: "¡Cuenta creada!",
            description: "Revisa tu correo para verificar tu cuenta.",
          });
          setIsLogin(true);
        } else {
          toast({
            title: "¡Bienvenido a TAMV!",
            description: "Tu cuenta ha sido creada exitosamente.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Identidad soberana ID-NVIDA",
    "IA emocional Isabella",
    "Economía TAU Credits",
    "Espacios 3D DreamWeave",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-secondary/10 to-background p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img src={logoImage} alt="TAMV" className="w-24 h-24 mb-6" />
            <h1 className="text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TAMV Online
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              El metaverso civilizatorio donde los creadores son dueños de su identidad, economía y contenido.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Protegido por ANUBIS Security Protocol</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-card/95 border-border shadow-2xl">
            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <img src={logoImage} alt="TAMV" className="w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin 
                  ? "Ingresa a tu cuenta TAMV" 
                  : "Únete al ecosistema civilizatorio"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                      className="mt-1"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Nombre de usuario (opcional)</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="tu_usuario"
                      className="mt-1"
                      maxLength={30}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mt-1"
                  maxLength={255}
                />
              </div>

              <div className="relative">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    minLength={6}
                    maxLength={72}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      minLength={6}
                      maxLength={72}
                    />
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal">
                      Acepto los términos de servicio y la política de privacidad de TAMV
                    </Label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    Procesando...
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "¿No tienes cuenta? Regístrate"
                  : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Volver al inicio
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
