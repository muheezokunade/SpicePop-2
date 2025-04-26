import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME } from '@/lib/constants';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | {SITE_NAME}</title>
        <meta name="description" content="Terms of Service for SpicePop - Read our terms and conditions for using our platform." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-cream py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms of Service</h1>
              
              <div className="prose prose-lg max-w-none">
                <p>Last Updated: April 26, 2025</p>
                
                <h2>1. Introduction</h2>
                <p>Welcome to SpicePop ("we", "our", or "us"). These Terms of Service govern your use of our website, products, and services. By accessing or using SpicePop, you agree to be bound by these terms.</p>
                
                <h2>2. Use of Our Services</h2>
                <p>You must use our services in accordance with these terms and applicable laws. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                
                <h2>3. Products and Orders</h2>
                <p>All product descriptions, images, and pricing information are provided for informational purposes and are subject to change without notice. We reserve the right to refuse any order at our discretion.</p>
                
                <h2>4. Payment Terms</h2>
                <p>Payment is processed at the time of order. We accept various payment methods including but not limited to credit/debit cards and Paystack. All prices are in Nigerian Naira (₦) and exclusive of any applicable taxes unless otherwise stated.</p>
                
                <h2>5. Shipping and Delivery</h2>
                <p>Please refer to our <a href="/shipping" className="text-primary hover:underline">Shipping Policy</a> for detailed information about shipping methods, timeframes, and costs.</p>
                
                <h2>6. Returns and Refunds</h2>
                <p>If you are not satisfied with your purchase, please contact us within 7 days of receiving your order. Products must be returned in their original condition and packaging. Perishable items may not be eligible for return.</p>
                
                <h2>7. Intellectual Property</h2>
                <p>All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of SpicePop and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
                
                <h2>8. User Conduct</h2>
                <p>When using our services, you agree not to:</p>
                <ul>
                  <li>Use our services for any illegal purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Attempt to access accounts or data not belonging to you</li>
                </ul>
                
                <h2>9. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, SpicePop shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services.</p>
                
                <h2>10. Governing Law</h2>
                <p>These terms are governed by and construed in accordance with the laws of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria.</p>
                
                <h2>11. Changes to Terms</h2>
                <p>We may update these terms from time to time. The most current version will be posted on our website with the effective date. Your continued use of our services after changes constitute your acceptance of the revised terms.</p>
                
                <h2>12. Contact Us</h2>
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                <p>Email: info@spicepop.net<br />
                Phone: +2348068989798<br />
                Address: 13, Signature estate Ikota, Lekki, Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}