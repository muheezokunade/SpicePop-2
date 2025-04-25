import { Link } from "wouter";
import { CalendarIcon } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`}>
        <a className="block h-full flex flex-col">
          {post.imageUrl && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
          )}
          
          <CardHeader className="pb-2 flex-initial">
            <div className="flex items-center text-sm text-muted-foreground gap-1.5 mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pb-4 flex-1">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          </CardContent>
          
          <CardFooter className="pt-3 border-t mt-auto">
            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
              Read More
            </Badge>
          </CardFooter>
        </a>
      </Link>
    </Card>
  );
}