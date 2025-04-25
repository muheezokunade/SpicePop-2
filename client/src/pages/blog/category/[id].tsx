import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useRoute } from "wouter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRightIcon, HomeIcon, PenIcon } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/blog/BlogCard";
import Loading from "@/components/Loading";
import { SITE_NAME } from "@/lib/constants";
import { BlogPost, Category } from "@shared/schema";

export default function BlogCategoryPage() {
  const [match, params] = useRoute("/blog/category/:id");
  const categoryId = params?.id;

  const { data: category } = useQuery<Category>({
    queryKey: ['/api/categories', categoryId],
    enabled: !!categoryId,
  });

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/category', categoryId],
    enabled: !!categoryId,
  });

  if (!match) {
    return null;
  }

  return (
    <Layout>
      <Helmet>
        <title>{category?.name || "Category"} Blog Posts | {SITE_NAME}</title>
        <meta name="description" content={`Explore articles about ${category?.name || "this category"}`} />
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
            <BreadcrumbLink href={`/blog/category/${categoryId}`} isCurrentPage>
              <ChevronRightIcon className="h-4 w-4 mr-2" />
              {category?.name || "Category"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {category?.name || "Category"} Articles
          </h1>
          <p className="text-muted-foreground">
            Explore articles related to {category?.name || "this category"}
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
              There are no articles in this category yet
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
    </Layout>
  );
}