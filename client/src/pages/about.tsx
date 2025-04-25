import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Features from '@/components/home/Features';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

export default function AboutPage() {
  // Update document title
  useEffect(() => {
    document.title = 'About Us | SpicePop';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>About Us | SpicePop</title>
        <meta name="description" content="Learn about SpicePop's story, mission, and our commitment to authentic Nigerian flavors." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-primary text-white py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-6">Our Story</h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                Bringing the rich, authentic flavors of Nigerian cuisine to food lovers everywhere.
              </p>
            </div>
          </section>
          
          {/* Our Mission */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-6">Our Mission</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    At SpicePop, we believe that every meal should be an opportunity to experience the vibrant 
                    flavors of Nigerian cuisine. Our mission is to make authentic Nigerian spices and foodstuffs 
                    accessible to everyone, while supporting local farmers and producers.
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    We carefully source our products directly from Nigerian farmers and markets, ensuring the 
                    highest quality and authenticity. Our team works hard to preserve traditional recipes and 
                    methods while introducing these incredible flavors to a wider audience.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Whether you're a Nigerian missing the tastes of home, a culinary explorer, or someone looking 
                    to add excitement to your cooking, SpicePop is here to bring those authentic flavors to your kitchen.
                  </p>
                </div>
                
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1590165482129-1b8b27698780" 
                    alt="Nigerian spice market" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Why Choose Us */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins text-center mb-12">
                Why Choose SpicePop
              </h2>
              
              <Features />
            </div>
          </section>
          
          {/* Our Journey */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins text-center mb-10">Our Journey</h2>
              
              <div className="max-w-4xl mx-auto">
                <div className="space-y-10">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-24 flex items-center justify-center">
                          <div className="text-xl font-bold text-primary">2020</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                          <p className="text-gray-700">
                            SpicePop started as a small passion project, bringing Nigerian spices to local markets 
                            and food fairs in Lagos. The enthusiastic response convinced us there was a wider 
                            demand for authentic Nigerian flavors.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-24 flex items-center justify-center">
                          <div className="text-xl font-bold text-primary">2021</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Building Partnerships</h3>
                          <p className="text-gray-700">
                            We established direct relationships with farmers and spice producers across Nigeria, 
                            ensuring sustainable sourcing while supporting local communities. These partnerships 
                            remain at the heart of our business today.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-24 flex items-center justify-center">
                          <div className="text-xl font-bold text-primary">2022</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Going Digital</h3>
                          <p className="text-gray-700">
                            As demand grew, we launched our online store to make our products accessible 
                            nationwide. We focused on creating a seamless shopping experience with quick delivery 
                            and exceptional customer service.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-24 flex items-center justify-center">
                          <div className="text-xl font-bold text-primary">Today</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Growing Community</h3>
                          <p className="text-gray-700">
                            Today, SpicePop is more than just an online store. We're a community of food lovers 
                            who appreciate authentic Nigerian flavors. We continue to expand our product range 
                            while staying true to our commitment to quality and authenticity.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
