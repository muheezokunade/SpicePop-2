import { Link } from 'wouter';
import { ArrowRight, Clock, Tag as TagIcon, CalendarDays, BookOpen, ScrollText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText } from '@/lib/utils';
import { BlogPost } from '@shared/schema';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  // Calculate reading time (roughly 200 words per minute)
  const getReadingTime = (content: string): number => {
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    return readingTime < 1 ? 1 : readingTime;
  };
  
  // Get category name from slug
  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return null;
    return DEFAULT_CATEGORIES.find(c => c.slug === categoryId)?.name || categoryId;
  };

  if (variant === 'compact') {
    return (
      <div className="flex gap-4 items-start py-4 group">
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <ScrollText className="h-6 w-6 text-primary/50" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="block after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {formatDate(new Date(post.createdAt))}
            </time>
            <span className="mx-2">•</span>
            <span>{getReadingTime(post.content)} min read</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20">
      {/* Image Container with Overlay */}
      <div className="relative h-52 overflow-hidden">
        {post.imageUrl ? (
          <>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/30" />
          </div>
        )}
        
        {/* Category Badge */}
        {post.categoryId && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-primary text-white font-medium shadow-sm"
          >
            {getCategoryName(post.categoryId)}
          </Badge>
        )}
        
        {/* Meta information overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 drop-shadow-sm">
            <Link href={`/blog/${post.slug}`} className="hover:text-primary/90 transition-colors">
              {post.title}
            </Link>
          </h3>
          
          <div className="flex items-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formatDate(new Date(post.createdAt))}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-5">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt || truncateText(post.content, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-5">
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-medium text-sm hover:underline">
          Read Article
          <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}