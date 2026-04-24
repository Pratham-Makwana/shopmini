import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useMetadata } from "@/hooks/use-metadata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingBag,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Zap,
  ShieldCheck,
  Truck,
} from "lucide-react";

/**
 * LoginPage Component
 * Split-layout authentication page with branded left panel
 */
export function LoginPage() {
  useMetadata({
    title: "Sign In - ShopMini",
    description: "Sign in to your ShopMini account to access your products and cart.",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ── Left brand panel (lg+) ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary p-12 text-primary-foreground">
        {/* Decorative blurred circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ShopMini</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Your favourite<br />products,{" "}
              <span className="text-white/75">all in one place.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-sm">
              Discover thousands of curated products with fast shipping and
              unbeatable prices.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="space-y-4">
            {[
              { icon: Zap, text: "Lightning-fast checkout experience" },
              { icon: Truck, text: "Free shipping on all orders" },
              { icon: ShieldCheck, text: "Secure payments & buyer protection" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} ShopMini. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex min-h-screen lg:min-h-0 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">ShopMini</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      username: undefined,
                    }));
                  }
                }}
                disabled={isSubmitting}
                aria-invalid={!!validationErrors.username}
                aria-describedby={
                  validationErrors.username ? "username-error" : undefined
                }
                className="h-11"
              />
              {validationErrors.username && (
                <p id="username-error" className="text-xs text-destructive">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={
                    validationErrors.password ? "password-error" : undefined
                  }
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
