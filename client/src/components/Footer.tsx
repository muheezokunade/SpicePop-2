import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter,
  Mail, 
  Phone, 
  MapPin,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  CONTACT_EMAIL, 
  CONTACT_PHONE, 
  CONTACT_ADDRESS, 
  FOOTER_LINKS, 
  SOCIAL_LINKS,
  SITE_NAME,
  FOUNDER 
} from "@/lib/constants";
import { NewSpicePopLogo } from "./NewSpicePopLogo";

export default function Footer() {
  return (
    <footer className="bg-primary-foreground border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/">
              <a className="flex items-center gap-3 mb-6">
                <NewSpicePopLogo width={48} height={48} variant="light" />
                <div>
                  <p className="font-semibold text-xl">{SITE_NAME}</p>
                  <p className="text-xs text-muted-foreground">Nigerian Spices & Foodstuffs</p>
                </div>
              </a>
            </Link>
            <p className="mb-6 text-muted-foreground text-sm max-w-sm">
              Bringing the authentic flavors of Nigerian cuisine to your doorstep with premium spices, 
              grains, and specialty foodstuffs.
            </p>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{CONTACT_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href={`tel:${CONTACT_PHONE}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-5 w-5 text-primary" />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-5 w-5 text-primary" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href={SOCIAL_LINKS.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-5 w-5 text-primary" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href={SOCIAL_LINKS.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="sr-only">TikTok</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.categories.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for recipes, tips, and exclusive offers!
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email address" 
                className="max-w-[240px]" 
              />
              <Button variant="outline" size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Founded by {FOUNDER}.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link, index) => (
              <Link key={index} href={link.href}>
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}