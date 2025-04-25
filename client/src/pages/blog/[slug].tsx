import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useRoute } from "wouter";
import { CalendarIcon, ChevronRightIcon, HomeIcon, PenIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { SITE_NAME } from "@/lib/constants";
import { BlogPost } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog', slug],
    enabled: !!slug,
  });

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!match) {
    return null;
  }

  return (
    <Layout>
      <Helmet>
        <title>{post?.title || "Blog Post"} | {SITE_NAME}</title>
        <meta name="description" content={post?.excerpt || "Loading blog post..."} />
      </Helmet>

      <div className="container py-8 md:py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">
              <ChevronRightIcon className="h-4 w-4 mr-2" />
              Blog
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/blog/${slug}`} isCurrentPage>
              <ChevronRightIcon className="h-4 w-4 mr-2" />
              {post?.title || "Loading..."}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {isLoading ? (
          <Loading />
        ) : error || !post ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PenIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">
              {error ? "Error loading blog post" : "Blog post not found"}
            </h2>
            <p className="text-muted-foreground mt-2 mb-6">
              {error ? "Please try again later" : "The post you're looking for doesn't exist"}
            </p>
            <Link href="/blog">
              <a className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Return to Blog
              </a>
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {post.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </div>
            
            <Separator className="mb-6" />
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />') 
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}