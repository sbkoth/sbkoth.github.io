import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ContentDialog from "./content-dialog";

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <>
      <div className="container mx-auto px-4 py-16 bg-accent/5">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Industry Insights</h2>
          <p className="text-lg text-muted-foreground">
            Deep dives into technical architecture, cloud solutions, and enterprise best practices.
            Stay updated with the latest in technology and system design.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedPost(post)}
            >
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video mb-4 overflow-hidden rounded-md">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedPost && (
        <ContentDialog
          title={selectedPost.title}
          content={selectedPost.content}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}