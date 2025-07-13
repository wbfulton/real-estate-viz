import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker for server-side rendering
if (typeof window === "undefined") {
  // Server-side: disable worker
  (pdfjsLib.GlobalWorkerOptions as { workerSrc: string | false }).workerSrc =
    false;
} else {
  // Client-side: use CDN worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function findTextPosition(
  arrayBuffer: ArrayBuffer,
  targetText: string,
) {
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    verbosity: 0, // Reduce logging
  });
  const pdf = await loadingTask.promise;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    for (const item of content.items) {
      if ("str" in item && item.str.includes(targetText)) {
        const transform = item.transform;
        const x = transform[4];
        const y = transform[5];
        const width = item.width;
        const height = item.height;

        return {
          pageNum,
          bbox: { x, y, width, height },
        };
      }
    }
  }

  return null; // not found
}
