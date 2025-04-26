import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_ENDPOINTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { BlogPost } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Helmet } from 'react-helmet';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PenBox,
  Pencil,
  Plus,
  Eye,
  MoreVertical,
  Trash2,
  Search,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import Loading from '@/components/Loading';

export default function AdminBlogPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Update document title
  useEffect(() => {
    document.title = 'Manage Blog | SpicePop Admin';
  }, []);

  // Fetch blog posts
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery<BlogPost[]>({
    queryKey: [API_ENDPOINTS.blog.all],
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', API_ENDPOINTS.blog.detail(id));
    },
    onSuccess: () => {
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully',
      });
      
      // Close delete dialog
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.blog.all] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.blog.list] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to delete blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) =>
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Handle sort toggle
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // Handle delete
  const confirmDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (postToDelete?.id) {
      deleteMutation.mutate(postToDelete.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Blog | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
              <p className="text-muted-foreground">
                Manage blog posts, articles, and recipes
              </p>
            </div>
            
            <Button
              onClick={() => setLocation('/admin/blog/new')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Blog Posts</CardTitle>
              <CardDescription>
                View, edit, or delete existing blog posts
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search blog posts..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="gap-2"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </Button>
              </div>
              
              {isLoading ? (
                <Loading />
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Error loading blog posts. Please try again.
                  </p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-8 text-center">
                  {searchTerm ? (
                    <p className="text-muted-foreground">
                      No blog posts matching "{searchTerm}"
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <PenBox className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">
                        No blog posts found. Create your first post!
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation('/admin/blog/new')}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        New Post
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[300px]">{post.title}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {post.excerpt}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={post.published ? 'default' : 'secondary'}
                              className={post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}
                            >
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(new Date(post.createdAt))}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setLocation(`/admin/blog/edit/${post.id}`)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => confirmDelete(post)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog post "{postToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}