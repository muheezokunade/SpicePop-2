import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { BlogPost, Category, insertBlogPostSchema } from '@shared/schema';
import { createSlug } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Image as ImageIcon,
  PenBox,
  Save,
  X,
  ArrowLeft,
  Eye,
} from 'lucide-react';

// Extend the schema for the form
const blogPostFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(30, 'Content must be at least 30 characters'),
  imageUrl: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  published: z.boolean().default(true),
  slug: z.string().optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  isEdit?: boolean;
}

export default function BlogPostForm({ post, isEdit = false }: BlogPostFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!isEdit);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.categories.list],
  });

  // Setup form with default values
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      imageUrl: post?.imageUrl || '',
      categoryId: post?.categoryId || '',
      published: post?.published ?? true,
    },
  });

  // Watch form values for auto-generating slug
  const title = form.watch('title');
  useEffect(() => {
    if (autoGenerateSlug && title) {
      form.setValue('slug', createSlug(title));
    }
  }, [title, autoGenerateSlug, form]);

  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      return await apiRequest('POST', API_ENDPOINTS.blog.create, data);
    },
    onSuccess: () => {
      toast({
        title: 'Blog post created!',
        description: 'Your blog post has been created successfully',
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.blog.list] });
      
      // Redirect to blog posts list
      setLocation('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      if (!post?.id) throw new Error('Blog post ID is required');
      return await apiRequest('PUT', API_ENDPOINTS.blog.detail(post.id), data);
    },
    onSuccess: () => {
      toast({
        title: 'Blog post updated!',
        description: 'Your blog post has been updated successfully',
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.blog.list] });
      if (post?.id) {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.blog.detail(post.id)] });
      }
      
      // Redirect to blog posts list
      setLocation('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    if (isEdit && post) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Toggle slug auto-generation
  const toggleAutoGenerateSlug = () => {
    setAutoGenerateSlug(!autoGenerateSlug);
    if (!autoGenerateSlug && title) {
      form.setValue('slug', createSlug(title));
    }
  };

  // Simple markdown preview renderer
  const renderMarkdown = (content: string) => {
    if (!content) return '';
    
    // Replace markdown headers
    let html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>');
    
    // Replace markdown lists
    html = html
      .replace(/^\s*- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^\s*\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');
    
    // Replace markdown paragraphs
    html = html.replace(/^\s*(.+)$/gim, function(match) {
      if (match.match(/^<li|^<h|^<p|^<ul|^<ol|^<div/)) {
        return match;
      }
      return '<p class="my-4">' + match + '</p>';
    });
    
    // Replace markdown bold and italic
    html = html
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Wrap adjacent list items with ul/ol
    html = html
      .replace(/<li class="ml-6 list-disc">/g, '<ul class="my-4"><li class="ml-6 list-disc">')
      .replace(/<li class="ml-6 list-decimal">/g, '<ol class="my-4"><li class="ml-6 list-decimal">');
    
    // Close lists
    html = html
      .replace(/<\/li>\s(?!<li)/g, '</li></ul>\n')
      .replace(/<\/li>\s(?!<li)/g, '</li></ol>\n');
    
    return html;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation('/admin/blog')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog Posts
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Exit Preview" : "Preview"}
            </Button>
            
            <Button 
              type="submit" 
              className="gap-2"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4" />
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
        
        {previewMode ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{form.getValues('title')}</h2>
                  {form.getValues('imageUrl') && (
                    <div className="w-full h-64 rounded-md overflow-hidden">
                      <img
                        src={form.getValues('imageUrl')}
                        alt={form.getValues('title')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground italic">{form.getValues('excerpt')}</p>
                  <Separator />
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(form.getValues('content')) }} 
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 py-3 px-6">
                <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                  <span>
                    Category: {categories?.find(c => c.id === form.getValues('categoryId'))?.name || 'Unknown'}
                  </span>
                  <span>
                    {form.getValues('published') ? 'Published' : 'Draft'}
                  </span>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="gap-2"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Post'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Slug Field */}
              <div className="flex items-end gap-4">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="enter-url-slug" 
                            {...field} 
                            disabled={autoGenerateSlug}
                          />
                        </FormControl>
                        <FormDescription>
                          The URL-friendly version of the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoGenerateSlug}
                  className="mb-2"
                >
                  {autoGenerateSlug ? 'Edit Manually' : 'Auto-generate'}
                </Button>
              </div>
              
              {/* Excerpt Field */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the blog post"
                        className="resize-none h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A short description that appears in blog listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content here... (supports markdown)"
                        className="min-h-[300px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Supports markdown formatting. Use # for headers, ** for bold, * for italic, - for lists.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {/* Publication Status */}
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this post visible to readers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Category Field */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingCategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image URL Field */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of the featured image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image Preview */}
                  {form.watch('imageUrl') && (
                    <div className="rounded-md overflow-hidden border">
                      <div className="aspect-video relative bg-muted">
                        <img
                          src={form.watch('imageUrl')}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => form.setValue('imageUrl', '')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!form.watch('imageUrl') && (
                    <div className="rounded-md overflow-hidden border border-dashed p-8 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground/60" />
                      <p className="text-sm text-muted-foreground">
                        No image URL provided
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}