import { Link } from 'wouter';
import { Calendar, ArrowRight, Clock, Tag as TagIcon, CalendarDays } from 'lucide-react';
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
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300 border hover:border-primary/20">
      {/* Image Container with Overlay */}
      <div className="relative h-56 overflow-hidden">
        {post.imageUrl ? (
          <>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        
        {/* Date Badge - New */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CalendarDays className="h-3 w-3" />
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {formatDate(new Date(post.createdAt))}
          </time>
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
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
        
        <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            <a className="block after:absolute after:inset-0 after:content-['']">
              {post.title}
            </a>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt || truncateText(post.content, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 pb-5">
        <Link href={`/blog/${post.slug}`}>
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/5 transition-colors"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}