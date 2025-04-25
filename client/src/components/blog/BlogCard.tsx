import { Link } from 'wouter';
import { Calendar, ArrowRight } from 'lucide-react';
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
    <Card className="overflow-hidden flex flex-col h-full">
      {post.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            <a className="hover:text-primary transition-colors">
              {post.title}
            </a>
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-2 mt-2">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          {truncateText(post.content, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between items-center">
        <Link href={`/blog/${post.slug}`}>
          <a>
            <Button variant="link" className="px-0 text-primary font-medium">
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </a>
        </Link>
        
        {post.categoryId && (
          <Badge variant="secondary">
            {/* Would ideally show the category name here */}
            {post.categoryId}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}