import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";

// Public Pages
import HomePage from "@/pages/index";
import ShopPage from "@/pages/shop";
import ProductPage from "@/pages/product/[id]";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog/[slug]";

// Admin Pages
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboardPage from "@/pages/admin/index";
import AdminProductsPage from "@/pages/admin/products";
import AdminNewProductPage from "@/pages/admin/products/new";
import AdminEditProductPage from "@/pages/admin/products/[id]";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminBlogPage from "@/pages/admin/blog";
import AdminNewBlogPostPage from "@/pages/admin/blog/new";
import AdminEditBlogPostPage from "@/pages/admin/blog/edit/[id]";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/products/new" component={AdminNewProductPage} />
      <Route path="/admin/products/:id" component={AdminEditProductPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/blog" component={AdminBlogPage} />
      <Route path="/admin/blog/new" component={AdminNewBlogPostPage} />
      <Route path="/admin/blog/edit/:id" component={AdminEditBlogPostPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
