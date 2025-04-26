import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';
import Loading from '@/components/Loading';
import { API_ENDPOINTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@shared/schema';
import { Helmet } from 'react-helmet';

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch blog post by ID
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<BlogPost>({
    queryKey: [API_ENDPOINTS.blog.detail(id)],
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load blog post. Please try again.',
        variant: 'destructive',
      });
      setLocation('/admin/blog');
    },
  });

  // Update document title
  useEffect(() => {
    document.title = post ? `Edit: ${post.title} | SpicePop Admin` : 'Edit Blog Post | SpicePop Admin';
  }, [post]);

  return (
    <>
      <Helmet>
        <title>{post ? `Edit: ${post.title} | SpicePop Admin` : 'Edit Blog Post | SpicePop Admin'}</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {post ? `Edit: ${post.title}` : 'Edit Blog Post'}
            </h1>
            <p className="text-muted-foreground">
              Update content, images, and settings
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Error loading blog post. Please try again.
              </p>
            </div>
          ) : post ? (
            <BlogPostForm post={post} isEdit={true} />
          ) : null}
        </div>
      </AdminLayout>
    </>
  );
}