import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta name="description" content="Privacy Policy for SpicePop - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-cream py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
              
              <div className="prose prose-lg max-w-none">
                <p>Last Updated: April 26, 2025</p>
                
                <h2>1. Introduction</h2>
                <p>At SpicePop, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully to understand our practices regarding your personal data.</p>
                
                <h2>2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul>
                  <li><strong>Personal Information:</strong> Name, email address, shipping address, phone number, and payment information when you make a purchase or create an account.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website, such as pages visited, time spent on pages, and clicking patterns.</li>
                  <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, and operating system.</li>
                </ul>
                
                <h2>3. How We Use Your Information</h2>
                <p>We use your information for various purposes, including to:</p>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and updates</li>
                  <li>Improve our website and services</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Prevent fraud and secure our website</li>
                </ul>
                
                <h2>4. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul>
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our business, such as payment processors, shipping companies, and marketing platforms.</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights or the safety of others.</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>
                
                <h2>5. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings.</p>
                
                <h2>6. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the internet or electronic storage method is 100% secure.</p>
                
                <h2>7. Your Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul>
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided below.</p>
                
                <h2>8. Children's Privacy</h2>
                <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
                
                <h2>9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. The most current version will be posted on our website with the effective date. We encourage you to review this policy periodically.</p>
                
                <h2>10. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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