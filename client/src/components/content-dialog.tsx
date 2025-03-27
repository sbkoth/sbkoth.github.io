import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { marked } from "marked";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentDialog({ title, content, isOpen, onClose }: ContentDialogProps) {
  // Use a simpler approach for rendering markdown with custom bullet points
  const processContent = () => {
    // Parse the markdown content
    const html = marked.parse(content) as string;
    
    // Replace default list items with custom styled ones (both ordered and unordered)
    // This uses regex to find list items and add our custom styling
    // Updated to match the CardBulletItem styling exactly
    const withBullets = html.replace(
      /<li>(.*?)<\/li>/g, 
      '<li class="flex items-center gap-2 my-2"><div class="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div><span class="text-sm">$1</span></li>'
    );
    
    // Enhance the styling of unordered lists to match CardBulletList
    const withUnorderedLists = withBullets.replace(
      /<ul>(.*?)<\/ul>/g, 
      '<ul class="space-y-2 my-4 list-none pl-0">$1</ul>'
    );
    
    // Enhance the styling of ordered lists to match unordered lists
    const withAllLists = withUnorderedLists.replace(
      /<ol>(.*?)<\/ol>/g, 
      '<ol class="space-y-2 my-4 list-none pl-0">$1</ol>'
    );
    
    return withAllLists;
  };

  const htmlContent = processContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose dark:prose-invert prose-primary mt-4 max-w-none prose-ul:pl-0 prose-ol:pl-0 prose-li:pl-0 prose-li:marker:hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}