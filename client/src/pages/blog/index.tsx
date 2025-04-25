import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon, PenIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Loading from "@/components/Loading";
import { SITE_NAME } from "@/lib/constants";
import { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Helmet>
          <title>Blog | {SITE_NAME}</title>
          <meta name="description" content="Explore articles about Nigerian spices, recipes, and cooking tips" />
        </Helmet>

        <div className="container py-8 md:py-12">
          <Breadcrumb className="mb-6">
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

          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              SpicePop Blog
            </h1>
            <p className="text-muted-foreground">
              Explore articles about Nigerian spices, recipes, and cooking tips
            </p>
          </div>

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}