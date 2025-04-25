import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if is admin
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/check'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
          throw new Error("Failed to check auth status");
        }
        
        return res.json();
      } catch (error) {
        throw error;
      }
    },
    retry: false,
    onError: () => {
      // If not authenticated and not on login page, redirect to login
      if (!location.startsWith('/admin/login')) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the admin area",
          variant: "destructive",
        });
        setLocation('/admin/login');
      }
    }
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !location.startsWith('/admin/login')) {
      setLocation('/admin/login');
    }
  }, [user, isLoading, location, setLocation]);
  
  // Close mobile sidebar on location change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);
  
  // Don't show layout on login page
  const [isLoginPage] = useRoute('/admin/login');
  if (isLoginPage) return <>{children}</>;
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation('/admin/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  const getNavIcon = (icon: string) => {
    switch (icon) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'FolderTree':
        return <FolderTree className="h-5 w-5" />;
      case 'ShoppingCart':
        return <ShoppingCart className="h-5 w-5" />;
      case 'Settings':
        return <Settings className="h-5 w-5" />;
      default:
        return <LayoutDashboard className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="bg-white shadow-md"
        >
          {isMobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`
          bg-dark text-white w-64 fixed inset-y-0 left-0 z-40 lg:relative transition-transform 
          lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6">
          <Link href="/admin">
            <a className="flex items-center">
              <Logo variant="footer" size="sm" />
            </a>
          </Link>
        </div>
        
        <Separator className="bg-gray-700" />
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {ADMIN_NAV_ITEMS.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
              >
                <a 
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${location === item.href ? 'bg-primary/80 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  {getNavIcon(item.icon)}
                  <span className="ml-3">{item.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <Separator className="bg-gray-700 mb-4" />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
