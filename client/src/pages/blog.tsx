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
  Mail,
  ChefHat,
  Flame,
  BookOpenCheck,
  Sparkles,
  ScrollText
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, truncateText } from "@/lib/utils";
import { SITE_NAME, DEFAULT_CATEGORIES } from "@/lib/constants";
import { BlogPost } from "@shared/schema";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // Filter posts by search term and category
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured posts (most recent 3 posts)
  const featuredPosts = posts?.slice(0, 3);
  
  // Get remaining posts for grid display
  const remainingPosts = posts?.slice(3);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  // Calculate reading time (roughly 200 words per minute)
  const getReadingTime = (content: string): number => {
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    return readingTime < 1 ? 1 : readingTime;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cream">
        <Helmet>
          <title>Culinary Blog | {SITE_NAME}</title>
          <meta name="description" content="Explore articles about Nigerian spices, recipes, and cooking tips. Learn about traditional cooking methods and modern adaptations." />
        </Helmet>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>
          <div className="container relative z-10 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                Culinary Insights
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-poppins">
                SpicePop Blog
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 mx-auto max-w-2xl">
                Explore the vibrant world of Nigerian cuisine, learn about our traditional spices, 
                and discover delicious recipes to bring the essence of West Africa to your kitchen.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search articles..." 
                    className="pl-10 pr-4 py-6 h-12 rounded-l-md text-gray-800 border-transparent focus:border-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="rounded-l-none bg-white text-primary hover:bg-white/90">
                  Search
                </Button>
              </form>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center mt-8 gap-2">
                <Button 
                  variant={!selectedCategory ? "secondary" : "outline"} 
                  size="sm"
                  className={!selectedCategory ? "bg-white text-primary hover:bg-white/90" : "bg-white/20 text-white hover:bg-white/30"}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Topics
                </Button>
                {DEFAULT_CATEGORIES.map((category) => (
                  <Button 
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "secondary" : "outline"}
                    size="sm"
                    className={selectedCategory === category.slug ? "bg-white text-primary hover:bg-white/90" : "bg-white/20 text-white hover:bg-white/30"}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
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
              {/* Featured Articles Section */}
              {featuredPosts && featuredPosts.length > 0 && !searchTerm && !selectedCategory && (
                <section>
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">Featured Articles</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main featured article */}
                    {featuredPosts[0] && (
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative h-64 lg:h-80 overflow-hidden">
                          {featuredPosts[0].imageUrl ? (
                            <>
                              <img 
                                src={featuredPosts[0].imageUrl} 
                                alt={featuredPosts[0].title} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                              <ScrollText className="h-16 w-16 text-primary/50" />
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          {featuredPosts[0].categoryId && (
                            <Badge 
                              className="absolute top-4 left-4 bg-primary text-white"
                            >
                              {DEFAULT_CATEGORIES.find(c => c.slug === featuredPosts[0].categoryId)?.name || featuredPosts[0].categoryId}
                            </Badge>
                          )}
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2 drop-shadow-md">
                              <Link href={`/blog/${featuredPosts[0].slug}`} className="hover:text-primary transition-colors">
                                {featuredPosts[0].title}
                              </Link>
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                              <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                <time dateTime={new Date(featuredPosts[0].createdAt).toISOString()}>
                                  {formatDate(new Date(featuredPosts[0].createdAt))}
                                </time>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{getReadingTime(featuredPosts[0].content)} min read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <p className="text-muted-foreground mb-6">
                            {featuredPosts[0].excerpt || truncateText(featuredPosts[0].content, 180)}
                          </p>
                          
                          <Link href={`/blog/${featuredPosts[0].slug}`} className="inline-flex items-center text-primary font-medium hover:underline">
                            Read Full Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {/* Side featured articles */}
                    <div className="grid grid-cols-1 gap-6 h-full">
                      {featuredPosts.slice(1, 3).map((post) => (
                        <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full">
                          <div className="md:w-1/3 h-48 md:h-auto relative">
                            {post.imageUrl ? (
                              <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                                <ScrollText className="h-10 w-10 text-primary/40" />
                              </div>
                            )}
                            
                            {/* Category Badge */}
                            {post.categoryId && (
                              <Badge 
                                className="absolute top-3 left-3 bg-primary/90 text-white"
                              >
                                {DEFAULT_CATEGORIES.find(c => c.slug === post.categoryId)?.name || post.categoryId}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="mb-2">
                              <h3 className="text-lg font-bold mb-2">
                                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                  {post.title}
                                </Link>
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  <time dateTime={new Date(post.createdAt).toISOString()}>
                                    {formatDate(new Date(post.createdAt))}
                                  </time>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{getReadingTime(post.content)} min read</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                              {post.excerpt || truncateText(post.content, 100)}
                            </p>
                            
                            <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary text-sm font-medium hover:underline">
                              Read Article
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
              
              {/* Main Articles Grid */}
              <section>
                <div className="flex items-center justify-between gap-2 mb-8">
                  <div className="flex items-center gap-2">
                    {searchTerm || selectedCategory ? (
                      <Search className="h-5 w-5 text-primary" />
                    ) : (
                      <BookOpenCheck className="h-5 w-5 text-primary" />
                    )}
                    <h2 className="text-2xl font-bold">
                      {searchTerm || selectedCategory ? 'Search Results' : 'Latest Articles'}
                    </h2>
                  </div>
                  
                  {(searchTerm || selectedCategory) && (
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {filteredPosts?.length || 0} articles found
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Active filters */}
                {(searchTerm || selectedCategory) && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        Search: {searchTerm}
                      </Badge>
                    )}
                    
                    {selectedCategory && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Category: {DEFAULT_CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {(searchTerm || selectedCategory ? filteredPosts : remainingPosts)?.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                
                {(searchTerm || selectedCategory) && filteredPosts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl shadow-sm p-8">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold">No results found</h2>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                      We couldn't find any articles matching your search criteria. 
                      Try different keywords or browse all articles.
                    </p>
                    <Button 
                      onClick={resetFilters}
                    >
                      View All Articles
                    </Button>
                  </div>
                )}
              </section>
              
              {/* Topic Sections */}
              {!searchTerm && !selectedCategory && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <ChefHat className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Cooking Techniques</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Master traditional Nigerian cooking methods from the experts. Learn the secrets 
                      behind perfect jollof rice, authentic soups, and more.
                    </p>
                    <Button variant="outline" className="w-full">
                      Explore Cooking Tips
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-secondary">
                      <Flame className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Spice Profiles</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Dive deep into the world of West African spices. Discover their origins, 
                      flavors, and how to use them in your everyday cooking.
                    </p>
                    <Button variant="outline" className="w-full">
                      Discover Spices
                    </Button>
                  </div>
                </section>
              )}
              
              {/* Newsletter Section */}
              <section className="bg-gradient-to-r from-primary/90 to-secondary/90 rounded-xl p-8 md:p-12 text-white shadow-md">
                <div className="max-w-3xl mx-auto text-center">
                  <Mail className="h-12 w-12 text-white/90 mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
                  <p className="text-white/80 mb-6">
                    Subscribe to receive the latest articles, recipes, and exclusive offers directly to your inbox.
                  </p>
                  
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button type="submit" className="bg-white text-primary hover:bg-white/90">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-white/60 text-xs mt-4">
                    We respect your privacy. You can unsubscribe at any time.
                  </p>
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