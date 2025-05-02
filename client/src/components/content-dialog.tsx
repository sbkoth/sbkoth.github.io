import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { marked } from "marked";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentDialog({ title, content, isOpen, onClose }: ContentDialogProps) {
  // Use a try-catch block to handle potential parsing errors
  const processContent = () => {
    try {
      // Check if content is empty or invalid
      if (!content || content.trim() === '') {
        return '<p class="text-muted-foreground">No content available for this item.</p>';
      }
      
      // Parse the markdown content
      const html = marked.parse(content) as string;
      
      // Replace default list items with custom styled ones (both ordered and unordered)
      // This uses regex to find list items and add our custom styling
      const withBullets = html.replace(
        /<li>(.*?)<\/li>/g, 
        '<li class="flex items-center gap-3 my-3"><div class="h-2.5 w-2.5 rounded-full bg-primary/80 flex-shrink-0"></div><span class="text-sm">$1</span></li>'
      );
      
      // Enhance the styling of unordered lists
      const withUnorderedLists = withBullets.replace(
        /<ul>(.*?)<\/ul>/g, 
        '<ul class="space-y-3 my-5 list-none pl-0">$1</ul>'
      );
      
      // Enhance the styling of ordered lists to match unordered lists
      const withAllLists = withUnorderedLists.replace(
        /<ol>(.*?)<\/ol>/g, 
        '<ol class="space-y-3 my-5 list-none pl-0">$1</ol>'
      );
      
      // Enhance headings
      const withHeadings = withAllLists.replace(
        /<h2>(.*?)<\/h2>/g,
        '<h2 class="text-xl font-semibold mt-6 mb-3 text-primary/90 border-b border-primary/20 pb-1">$1</h2>'
      ).replace(
        /<h3>(.*?)<\/h3>/g,
        '<h3 class="text-lg font-medium mt-5 mb-2 text-primary/80">$1</h3>'
      );
      
      // Add blockquote styling
      const withBlockquotes = withHeadings.replace(
        /<blockquote>(.*?)<\/blockquote>/g,
        '<blockquote class="border-l-4 border-primary/30 pl-4 py-1 my-4 bg-primary/5 rounded-r italic">$1</blockquote>'
      );
      
      // Process link styling
      const withLinks = withBlockquotes.replace(
        /<a\s+href="(.*?)">(.*?)<\/a>/g,
        '<a href="$1" class="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">$2</a>'
      );
      
      return withLinks;
    } catch (error) {
      console.error('Error processing content:', error);
      return '<p class="text-red-500">There was an error processing this content.</p>';
    }
  };

  // Only process content if it exists
  const htmlContent = processContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="border-b border-muted pb-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title || 'Details'}
          </DialogTitle>
        </DialogHeader>
        <div 
          className="prose dark:prose-invert mt-6 max-w-none prose-ul:pl-0 prose-ol:pl-0 prose-li:pl-0 prose-li:marker:hidden
                     prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:my-4
                     prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}