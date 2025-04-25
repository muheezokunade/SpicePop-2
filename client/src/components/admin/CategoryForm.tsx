import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Category } from '@shared/schema';
import { createSlug } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/constants';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Form schema based on the category model
const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  imageUrl: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  categoryId?: string;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  
  // Fetch category data if editing
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [API_ENDPOINTS.categories.detail(categoryId || '')],
    enabled: !!categoryId,
  });
  
  // Form definition
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      imageUrl: '',
    },
  });
  
  // Update form with category data when available
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl || '',
      });
    }
  }, [category, form]);
  
  // Auto-generate slug when name changes
  const watchedName = form.watch('name');
  useEffect(() => {
    if (watchedName && !form.getValues('slug') && !isGeneratingSlug) {
      setIsGeneratingSlug(true);
      const slug = createSlug(watchedName);
      form.setValue('slug', slug);
      setIsGeneratingSlug(false);
    }
  }, [watchedName, form, isGeneratingSlug]);
  
  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await apiRequest('POST', API_ENDPOINTS.categories.list, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.categories.list] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      setLocation('/admin/categories');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await apiRequest('PUT', API_ENDPOINTS.categories.detail(categoryId || ''), data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.categories.list] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.categories.detail(categoryId || '')] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      setLocation('/admin/categories');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: CategoryFormValues) => {
    if (categoryId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Show loading state
  if (categoryId && isCategoryLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for the category image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLocation('/admin/categories')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : categoryId ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
