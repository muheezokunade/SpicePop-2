import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { Helmet } from 'react-helmet';

export default function NewBlogPostPage() {
  // Update document title
  useEffect(() => {
    document.title = 'New Blog Post | SpicePop Admin';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>New Blog Post | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">New Blog Post</h1>
            <p className="text-muted-foreground">Create a new blog post, article, or recipe</p>
          </div>
          
          <BlogPostForm />
        </div>
      </AdminLayout>
    </>
  );
}