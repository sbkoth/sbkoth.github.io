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
    let html = marked.parse(content);
    
    // Replace default list items with custom styled ones
    // This uses regex to find list items and add our custom styling
    html = html.replace(
      /<li>(.*?)<\/li>/g, 
      '<li class="flex items-center gap-2 my-2"><div class="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div><span>$1</span></li>'
    );
    
    // Enhance the styling of unordered lists
    html = html.replace(
      /<ul>(.*?)<\/ul>/gs, 
      '<ul class="space-y-2 my-4 list-none pl-0">$1</ul>'
    );
    
    return html;
  };

  const htmlContent = processContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose dark:prose-invert prose-primary mt-4 max-w-none prose-ul:pl-0 prose-li:pl-0 prose-li:marker:hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}