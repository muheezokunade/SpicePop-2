import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { MAIN_NAV_ITEMS } from '@/lib/constants';
import { useCart } from '@/lib/contexts/CartContext';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [location] = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
                <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {MAIN_NAV_ITEMS.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`font-medium hover:text-primary transition-colors ${location === item.href ? 'text-primary' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Cart" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" aria-label="Account" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-white shadow-md px-4 py-2 md:hidden">
            <nav className="flex flex-col space-y-3 py-3">
              {MAIN_NAV_ITEMS.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`font-medium hover:text-primary transition-colors py-2 ${location === item.href ? 'text-primary' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
