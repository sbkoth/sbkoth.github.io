import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { renderSafeMarkdown } from "@/lib/sanitize-markdown";

interface ContentDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentDialog({ title, content, isOpen, onClose }: ContentDialogProps) {
  const htmlContent = useMemo(() => renderSafeMarkdown(content || ""), [content]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto rounded-lg border-primary/35 bg-card font-mono shadow-[0_24px_80px_-20px_hsl(0_0%_0%_/_0.7)] duration-200">
        <DialogHeader className="border-b border-border pb-3">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            $ cat {title.toLowerCase().replace(/\s+/g, "-")}.md
          </p>
          <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div
          className="prose-terminal mt-2"
          // Safe: HTML produced only via renderSafeMarkdown (marked + DOMPurify)
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
}
