import { Link } from 'wouter';
import { Logo } from '@/components/Logo';
import { 
  FOOTER_LINKS, 
  SOCIAL_LINKS, 
  CONTACT_EMAIL, 
  CONTACT_PHONE, 
  CONTACT_WHATSAPP, 
  CONTACT_ADDRESS 
} from '@/lib/constants';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={18} />;
      case 'instagram':
        return <Instagram size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      case 'whatsapp':
        return <MessageCircle size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <footer className="bg-dark text-cream pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div>
            <Logo variant="footer" className="mb-6" />
            <p className="opacity-80 mb-4">
              Bringing authentic Nigerian flavors to your kitchen with premium quality spices and foodstuffs.
            </p>
            <div className="flex space-x-4">
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <a 
                  key={platform}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cream hover:text-secondary transition-colors" 
                  aria-label={platform}
                >
                  {renderSocialIcon(platform)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-cream/80 hover:text-secondary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.categories.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-cream/80 hover:text-secondary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-secondary" size={18} />
                <span className="text-cream/80">{CONTACT_ADDRESS}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-secondary" size={18} />
                <span className="text-cream/80">{CONTACT_PHONE}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-secondary" size={18} />
                <span className="text-cream/80">{CONTACT_EMAIL}</span>
              </li>
              <li className="flex items-center">
                <MessageCircle className="mr-3 text-secondary" size={18} />
                <span className="text-cream/80">{CONTACT_WHATSAPP}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-cream/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream/60 text-sm mb-4 md:mb-0">
            &copy; {currentYear} SpicePop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {FOOTER_LINKS.legal.map(link => (
              <Link key={link.href} href={link.href}>
                <a className="text-cream/60 hover:text-cream text-sm">
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
