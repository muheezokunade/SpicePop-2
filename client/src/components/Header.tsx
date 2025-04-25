import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import { useCart } from "@/lib/contexts/CartContext";
import { SpicePopLogo } from "./SpicePopLogo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [location] = useLocation();
  const { cart } = useCart();
  
  const cartItemsCount = cart?.items?.reduce(
    (count, item) => count + item.quantity, 
    0
  ) || 0;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center gap-2">
              <SpicePopLogo width={40} height={40} />
              <span className="font-semibold text-lg hidden md:inline-block">SpicePop</span>
            </a>
          </Link>
          
          {!isMobile && (
            <nav className="flex gap-6">
              {MAIN_NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <a className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-[1rem] items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </a>
          </Link>
          
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="px-2 py-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <a className="flex items-center gap-2 mb-8">
                      <SpicePopLogo width={40} height={40} />
                      <span className="font-semibold text-lg">SpicePop</span>
                    </a>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {MAIN_NAV_ITEMS.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <a
                          className={`text-sm font-medium transition-colors hover:text-primary ${
                            location === item.href ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}