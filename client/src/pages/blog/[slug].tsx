import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, Calendar, Tag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME } from "@/lib/constants";
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
          <div className="container py-12">
            <Loading />
          </div>
        ) : error ? (
          <div className="container py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-semibold">Failed to load blog post</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                The post you're looking for couldn't be found.
              </p>
              <Link href="/blog">
                <span className="flex items-center text-primary hover:underline cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </span>
              </Link>
            </div>
          </div>
        ) : !post ? (
          <div className="container py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-semibold">Blog post not found</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <span className="flex items-center text-primary hover:underline cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="container py-8 md:py-12">
              {/* Breadcrumb */}
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
                  <BreadcrumbLink href="/blog">
                    Blog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/blog/${post.slug}`} isCurrentPage>
                    {post.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              
              {/* Post Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  
                  {post.categoryId && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" />
                      <Badge variant="secondary">
                        {/* We would ideally fetch the category name here */}
                        {post.categoryId}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              {/* Back to Blog Link */}
              <div className="mt-12 pt-6 border-t">
                <Link href="/blog">
                  <span className="inline-flex items-center text-primary hover:underline cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}