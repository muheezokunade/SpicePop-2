import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, PenIcon, BookOpen, ChefHat, Utensils, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // If we have posts, find the featured (first) post
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  // Rest of the posts
  const regularPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Helmet>
          <title>Blog | {SITE_NAME}</title>
          <meta name="description" content="Explore articles about Nigerian spices, recipes, and cooking tips" />
        </Helmet>

        {/* Hero Section with Background */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="#f97316" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </div>
          
          <div className="container relative py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 drop-shadow-sm">
                Discover The Flavors of Nigeria
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Recipes, cooking tips, and stories about authentic Nigerian spices and ingredients
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mb-10">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Recipes
                </Button>
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                  <Utensils className="mr-2 h-4 w-4" />
                  Cooking Tips
                </Button>
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Food Stories
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <span className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Home
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog" isCurrentPage>
                Blog
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {isLoading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Error loading blog posts</h2>
              <p className="text-muted-foreground mt-2">
                Please try again later
              </p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">No blog posts found</h2>
              <p className="text-muted-foreground mt-2">
                Check back later for new articles
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post Section */}
              {featuredPost && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-primary" />
                    Featured Article
                  </h2>
                  
                  <div className="grid md:grid-cols-5 gap-8 items-center">
                    <div className="md:col-span-2 h-64 md:h-96 overflow-hidden rounded-xl">
                      {featuredPost.imageUrl ? (
                        <img 
                          src={featuredPost.imageUrl} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <PenIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-3 space-y-4">
                      <h3 className="text-3xl font-bold">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          <span className="hover:text-primary transition-colors cursor-pointer">
                            {featuredPost.title}
                          </span>
                        </Link>
                      </h3>
                      
                      <p className="text-muted-foreground text-lg">{featuredPost.excerpt}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <time dateTime={new Date(featuredPost.createdAt).toISOString()}>
                          {new Date(featuredPost.createdAt).toLocaleDateString('en-NG', { 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="mx-2">•</span>
                        <span>6 min read</span>
                      </div>
                      
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button className="mt-4">
                          Read Full Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* More Articles Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <PenIcon className="mr-2 h-6 w-6 text-primary" />
                  More Articles
                </h2>
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                  <p className="text-muted-foreground mb-6">
                    Get the latest recipes, cooking tips, and exclusive offers delivered to your inbox
                  </p>
                  <div className="flex max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button className="rounded-l-none">Subscribe</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}