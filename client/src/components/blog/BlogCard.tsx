import { Link } from 'wouter';
import { Calendar, ArrowRight, Clock, Tag as TagIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText } from '@/lib/utils';
import { BlogPost } from '@shared/schema';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-all duration-300 border-muted hover:border-primary/20">
      {/* Image Container with Overlay */}
      <div className="relative h-52 overflow-hidden">
        {post.imageUrl ? (
          <>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <TagIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Category Badge */}
        {post.categoryId && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-white/90 text-primary font-medium shadow-sm"
          >
            {post.categoryId}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-NG', { 
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>3 min read</span>
          </div>
        </div>
        
        <CardTitle className="line-clamp-2 text-xl">
          <Link href={`/blog/${post.slug}`}>
            <span className="hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </span>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">
          {post.excerpt || truncateText(post.content, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Link href={`/blog/${post.slug}`}>
          <Button 
            variant="ghost" 
            className="text-primary font-medium cursor-pointer group-hover:bg-primary/5 transition-colors p-0 h-auto"
          >
            Read Full Article
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}