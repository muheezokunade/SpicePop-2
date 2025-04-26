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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

export default function Header() {
  const [location, setLocation] = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchOpen(false);
      setLocation(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      console.log('Header search redirecting to:', `/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
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
                  className={`text-sm font-medium hover:text-primary transition-colors ${location === item.href ? 'text-primary' : 'text-gray-700'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
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
            <div className="py-3 mb-2">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-start text-gray-600"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search products
              </Button>
            </div>
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
      
      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4 pt-4">
            <div className="flex items-center relative">
              <Input
                id="header-search"
                type="text"
                placeholder="Search for spices, foodstuff, snacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 text-gray-400 hover:text-primary"
                disabled={!searchTerm.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSearchOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!searchTerm.trim()}
              >
                Search
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}