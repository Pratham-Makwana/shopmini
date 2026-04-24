import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { CartSidebar } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, LogOut, User } from "lucide-react";

/**
 * Navbar Component
 * Sticky glassmorphic navigation bar with indigo-accented branding
 */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/products"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2 transition-colors group-hover:bg-primary/15">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">ShopMini</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && <CartSidebar />}

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 ring-2 ring-border hover:ring-primary/30 transition-all"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image} alt={user.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button size="sm" className="font-semibold">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
