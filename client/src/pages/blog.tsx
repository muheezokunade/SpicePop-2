import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  HomeIcon, 
  PenIcon, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Tag, 
  CalendarDays, 
  Clock, 
  ArrowRight,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, truncateText } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { BlogPost } from "@shared/schema";
import { useState } from "react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // Filter posts by search term
  const filteredPosts = posts?.filter(post => 
    !searchTerm || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get featured posts (most recent 1 post)
  const featuredPost = posts?.[0];
  
  // Get remaining posts for grid display
  const remainingPosts = posts?.slice(1);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Helmet>
          <title>Blog | {SITE_NAME}</title>
          <meta name="description" content="Explore articles about Nigerian spices, recipes, and cooking tips" />
        </Helmet>

        {/* Hero Section */}
        <section className="bg-primary/5 border-b">
          <div className="container py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                SpicePop Blog
              </h1>
              <p className="text-lg text-muted-foreground mb-8 mx-auto max-w-2xl">
                Discover the rich flavors of Nigerian cuisine, learn about our traditional spices, 
                and find delicious recipes to elevate your cooking experience.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search articles..." 
                    className="pl-10 pr-4 py-6 h-12 rounded-l-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="rounded-l-none border border-primary">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        <div className="container py-12">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
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
            <Loading />
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
            <div className="space-y-16">
              {/* Featured Article Section */}
              {featuredPost && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Featured Article</h2>
                  </div>
                  
                  <div className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="relative h-64 lg:h-full">
                        {featuredPost.imageUrl ? (
                          <img 
                            src={featuredPost.imageUrl} 
                            alt={featuredPost.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <PenIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-8 flex flex-col">
                        <div className="mb-4">
                          {featuredPost.categoryId && (
                            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-3">
                              {featuredPost.categoryId}
                            </span>
                          )}
                          <h3 className="text-2xl font-bold mb-3">
                            <Link href={`/blog/${featuredPost.slug}`}>
                              <a className="hover:text-primary transition-colors">
                                {featuredPost.title}
                              </a>
                            </Link>
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4" />
                              <time dateTime={new Date(featuredPost.createdAt).toISOString()}>
                                {formatDate(new Date(featuredPost.createdAt))}
                              </time>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>5 min read</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 flex-grow">
                          {featuredPost.excerpt || truncateText(featuredPost.content, 220)}
                        </p>
                        
                        <Link href={`/blog/${featuredPost.slug}`}>
                          <Button className="w-full sm:w-auto">
                            Read Full Article
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Main Articles Grid */}
              <section>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <PenIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Latest Articles</h2>
                  </div>
                  {searchTerm && (
                    <div className="text-sm text-muted-foreground">
                      {filteredPosts?.length || 0} results for "{searchTerm}"
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {(searchTerm ? filteredPosts : remainingPosts)?.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                
                {searchTerm && filteredPosts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold">No results found</h2>
                    <p className="text-muted-foreground mt-2">
                      Try different keywords or browse all articles
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      View All Articles
                    </Button>
                  </div>
                )}
              </section>
              
              {/* Newsletter Section */}
              <section className="bg-primary/5 rounded-xl p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to receive the latest articles, recipes, and special offers directly to your inbox.
                  </p>
                  
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1"
                    />
                    <Button type="submit">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}