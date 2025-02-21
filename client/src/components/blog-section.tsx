import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@shared/schema";

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="aspect-video mb-4">
                <img 
                  src={post.thumbnail} 
                  alt={post.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
