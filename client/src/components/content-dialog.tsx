import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { marked } from "marked";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentDialog({ title, content, isOpen, onClose }: ContentDialogProps) {
  const htmlContent = marked(content);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose dark:prose-invert prose-primary mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}