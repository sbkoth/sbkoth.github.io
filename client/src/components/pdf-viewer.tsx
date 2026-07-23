interface PdfViewerProps {
  url: string;
}

/** Lightweight PDF embed — avoids heavy pdfjs-dist for rarely used project type. */
export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div className="w-full h-[70vh]">
      <iframe title="PDF document" src={url} className="w-full h-full border-0 rounded-md" />
    </div>
  );
}
