import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME } from '@/lib/constants';

export default function ShippingPage() {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | {SITE_NAME}</title>
        <meta name="description" content="Shipping Policy for SpicePop - Learn about our shipping methods, timeframes, and costs." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 bg-cream py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Shipping Policy</h1>
              
              <div className="prose prose-lg max-w-none">
                <p>Last Updated: April 26, 2025</p>
                
                <h2>1. Shipping Methods and Timeframes</h2>
                <p>At SpicePop, we are committed to delivering your authentic Nigerian spices, foodstuffs, and snacks in a timely manner. We offer the following shipping options:</p>
                
                <h3>Standard Shipping (Within Lagos)</h3>
                <ul>
                  <li>Delivery Time: 1-2 business days</li>
                  <li>Cost: ₦1,500 for orders under ₦10,000</li>
                  <li>Free shipping for orders over ₦10,000</li>
                </ul>
                
                <h3>Standard Shipping (Outside Lagos)</h3>
                <ul>
                  <li>Delivery Time: 2-5 business days</li>
                  <li>Cost: ₦2,500 for orders under ₦15,000</li>
                  <li>Free shipping for orders over ₦15,000</li>
                </ul>
                
                <h3>Express Shipping (Within Lagos)</h3>
                <ul>
                  <li>Delivery Time: Same day delivery for orders placed before 12 PM</li>
                  <li>Cost: ₦3,000</li>
                </ul>
                
                <h2>2. Order Processing</h2>
                <p>Orders are processed within 24 hours of being placed. Once your order has been processed, you will receive a confirmation email with your tracking information. Shipping timeframes begin once your order has been processed and do not include weekends or public holidays.</p>
                
                <h2>3. Shipping Locations</h2>
                <p>We currently ship to all states within Nigeria. For international shipping, please contact our customer service team at info@spicepop.net for more information and custom shipping quotes.</p>
                
                <h2>4. Shipping Restrictions</h2>
                <p>Some products may be subject to shipping restrictions due to their perishable nature. These restrictions will be clearly noted on the product page. We also reserve the right to restrict shipping certain items to specific regions based on customs regulations and product preservation requirements.</p>
                
                <h2>5. Tracking Your Order</h2>
                <p>Once your order has shipped, you will receive a tracking number via email. You can track your order by:</p>
                <ul>
                  <li>Visiting the 'Order History' section in your account</li>
                  <li>Clicking the tracking link in your shipping confirmation email</li>
                  <li>Contacting our customer service team with your order number</li>
                </ul>
                
                <h2>6. Delivery Issues</h2>
                <p>In the event of a delivery issue, such as a delayed, lost, or damaged package, please contact our customer service team immediately. We will work with our shipping partners to resolve the issue as quickly as possible.</p>
                
                <h2>7. Address Accuracy</h2>
                <p>It is your responsibility to provide accurate shipping information. SpicePop is not responsible for packages that are undeliverable due to incorrect address information. If a package is returned to us due to an incorrect address, you may be charged for re-shipping.</p>
                
                <h2>8. Customs and Import Duties</h2>
                <p>For international shipments, the recipient is responsible for any customs duties, taxes, and import fees that may be imposed by the destination country. These fees are not included in our shipping costs and will be collected by the delivery carrier or customs office.</p>
                
                <h2>9. Contact Us</h2>
                <p>If you have any questions about our shipping policy, please contact us at:</p>
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