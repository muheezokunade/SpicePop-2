import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  HomeIcon, Calendar, Tag, ArrowLeft, 
  Clock, Share2, Facebook, Twitter, Instagram,
  Bookmark, ThumbsUp, MessageCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
  });
  
  // For SEO and meta tags
  const pageTitle = post ? `${post.title} | Blog | ${SITE_NAME}` : `Blog | ${SITE_NAME}`;
  const pageDescription = post?.excerpt || "Explore articles about Nigerian spices, recipes, and cooking tips";
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          {post?.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        </Helmet>

        {isLoading ? (
          <div className="container py-16 flex justify-center">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <div className="container py-16">
            <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                <ArrowLeft className="h-6 w-6 text-rose-500" />
              </div>
              <h2 className="text-xl font-semibold">Failed to load blog post</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                The post you're looking for couldn't be found.
              </p>
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        ) : !post ? (
          <div className="container py-16">
            <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <ArrowLeft className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold">Blog post not found</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Image with Title Overlay */}
            <div className="relative w-full">
              {post.imageUrl ? (
                <div className="relative h-[50vh] overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 text-white p-8 container">
                    <div className="max-w-4xl">
                      {post.categoryId && (
                        <Badge variant="secondary" className="mb-4 bg-primary text-white border-none">
                          {post.categoryId}
                        </Badge>
                      )}
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-sm">
                        {post.title}
                      </h1>
                      <p className="text-lg text-gray-100 max-w-2xl mb-6 drop-shadow-sm hidden md:block">
                        {post.excerpt}
                      </p>
                      
                      {/* Post Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString('en-NG', { 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-20 px-4">
                  <div className="container">
                    <div className="max-w-4xl mx-auto">
                      {post.categoryId && (
                        <Badge className="mb-4">
                          {post.categoryId}
                        </Badge>
                      )}
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        {post.title}
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                        {post.excerpt}
                      </p>
                      
                      {/* Post Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString('en-NG', { 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="container py-12">
              {/* Breadcrumb */}
              <div className="max-w-4xl mx-auto">
                <Breadcrumb className="mb-8">
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
                    <BreadcrumbLink href="/blog">
                      Blog
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/blog/${post.slug}`} isCurrentPage>
                      {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                
                {/* Content Layout with Sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
                  {/* Social Share Sidebar */}
                  <div className="hidden md:block md:col-span-1">
                    <div className="sticky top-24 flex flex-col items-center gap-4">
                      <span className="text-xs text-muted-foreground">Share</span>
                      <div className="flex flex-col gap-3">
                        <a 
                          href={SOCIAL_LINKS.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a 
                          href={SOCIAL_LINKS.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-100 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a 
                          href={SOCIAL_LINKS.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="w-px h-16 bg-gray-200 my-2"></div>
                      
                      <div className="flex flex-col gap-3">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors">
                          <Bookmark className="h-5 w-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors">
                          <ThumbsUp className="h-5 w-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                          <MessageCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="md:col-span-6">
                    {/* Post excerpt for mobile */}
                    {post.imageUrl && (
                      <p className="text-lg text-muted-foreground max-w-2xl mb-8 md:hidden">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-900 prose-img:rounded-lg">
                      {post.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    
                    {/* Tags */}
                    <div className="mt-10 pt-6 border-t flex flex-wrap gap-2">
                      <Badge variant="outline" className="px-3 py-1">
                        Nigerian Food
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Spices
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Cooking
                      </Badge>
                    </div>
                    
                    {/* Author Bio */}
                    <div className="mt-10 pt-8 border-t">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xl font-bold text-primary">SF</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">SpicePop Food Team</h3>
                          <p className="text-muted-foreground mt-1">
                            Our team of culinary experts and food enthusiasts bring you the best of Nigerian cuisine,
                            with tips and recipes to elevate your cooking experience.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Share Buttons */}
                    <div className="mt-8 flex gap-2 md:hidden">
                      <span className="text-sm text-muted-foreground mr-2 self-center">Share:</span>
                      <a 
                        href={SOCIAL_LINKS.facebook} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a 
                        href={SOCIAL_LINKS.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-sky-100 text-sky-500"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a 
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-100 text-pink-600"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    </div>
                    
                    {/* Back to Blog Link */}
                    <div className="mt-8">
                      <Link href="/blog">
                        <Button variant="outline" className="gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back to All Articles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Related Posts */}
              <div className="max-w-7xl mx-auto mt-16 pt-10 border-t">
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <span className="mr-2">📚</span> You might also like
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col rounded-lg overflow-hidden border bg-card hover:shadow-md transition-shadow">
                      <div className="h-48 bg-muted/50 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                          <Tag className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">Nigerian Cuisine</p>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                          Discover more recipes and cooking tips on our blog
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="max-w-5xl mx-auto mt-16 p-10 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">Never Miss a Recipe!</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                    Subscribe to our newsletter to receive the latest recipes, cooking tips, and exclusive offers
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-2 rounded-md border flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button className="px-6">Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}