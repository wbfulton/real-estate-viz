import { PDFDocument } from "pdf-lib";
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

export interface TextMatch {
  text: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export class PDFProcessor {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  private pdfData: Uint8Array | null = null;

  async loadPDF(pdfBuffer: string): Promise<void> {
    try {
      this.pdfData = new Uint8Array(Buffer.from(pdfBuffer, "base64"));

      // For server-side rendering, we need to handle the worker differently
      const loadingTask = pdfjsLib.getDocument({
        data: this.pdfData,
        verbosity: 0, // Reduce logging
      });

      this.pdfDoc = await loadingTask.promise;
      console.log(`PDF loaded successfully with ${this.pdfDoc.numPages} pages`);
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw new Error(
        `Failed to load PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async findTextInstances(searchText: string): Promise<TextMatch[]> {
    if (!this.pdfDoc) {
      throw new Error("PDF not loaded. Call loadPDF() first.");
    }

    const matches: TextMatch[] = [];

    try {
      console.log(
        `Searching for text: "${searchText}" in ${this.pdfDoc.numPages} pages`,
      );

      // Process each page
      for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
        const page = await this.pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Get page dimensions
        const viewport = page.getViewport({ scale: 1.0 });
        console.log(
          `Page ${pageNum} dimensions: ${viewport.width} x ${viewport.height}`,
        );

        // Search through text items
        for (const item of textContent.items) {
          if ("str" in item && item.str.trim()) {
            const itemText = item.str.toLowerCase();
            const searchTextLower = searchText.toLowerCase();

            // Check if the text contains the search term
            if (itemText.includes(searchTextLower)) {
              // Calculate coordinates
              const transform = item.transform;
              const x = transform[4];
              const y = viewport.height - transform[5]; // Flip Y coordinate

              // Calculate font size from transform matrix
              const fontSize = Math.sqrt(
                transform[0] * transform[0] + transform[1] * transform[1],
              );

              // Calculate text dimensions more accurately
              let width = item.width;
              if (!width) {
                // Estimate width based on character count and font size
                width = item.str.length * fontSize * 0.6;
              }
              const height = fontSize;

              // Only add if the text is actually visible and has reasonable dimensions
              if (width > 0 && height > 0 && x >= 0 && y >= 0) {
                console.log(
                  `Found match on page ${pageNum}: "${item.str}" at (${x}, ${y})`,
                );
                matches.push({
                  text: item.str,
                  page: pageNum,
                  x,
                  y,
                  width,
                  height,
                  fontSize,
                });
              }
            }
          }
        }
      }

      console.log(`Found ${matches.length} text matches`);
    } catch (error) {
      console.error("Error finding text instances:", error);
      throw new Error(
        `Failed to find text instances: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    return matches;
  }

  async cropPDF(cropAreas: CropArea[]): Promise<string> {
    if (!this.pdfData) {
      throw new Error("PDF not loaded. Call loadPDF() first.");
    }

    try {
      console.log(`Cropping PDF with ${cropAreas.length} areas`);

      // Load the PDF document with pdf-lib
      const pdfDoc = await PDFDocument.load(this.pdfData);

      // Create a new PDF document for the cropped areas
      const croppedPdf = await PDFDocument.create();

      for (const area of cropAreas) {
        console.log(
          `Processing crop area: page ${area.page}, x=${area.x}, y=${area.y}, w=${area.width}, h=${area.height}`,
        );

        // Get the specified page (PDF pages are 0-indexed)
        const pdfPage = pdfDoc.getPage(area.page - 1);

        // Get page dimensions
        const pageHeight = pdfPage.getHeight();
        const pageWidth = pdfPage.getWidth();

        // Add the page to the new document
        const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [
          area.page - 1,
        ]);
        croppedPdf.addPage(copiedPage);

        // Convert coordinates from PDF.js (top-left origin) to pdf-lib (bottom-left origin)
        // PDF.js: (0,0) at top-left, Y increases downward
        // pdf-lib: (0,0) at bottom-left, Y increases upward
        const pdfLibY = pageHeight - area.y - area.height;

        // Ensure crop area is within page bounds
        const cropX = Math.max(0, Math.min(area.x, pageWidth));
        const cropY = Math.max(0, Math.min(pdfLibY, pageHeight));
        const cropWidth = Math.min(area.width, pageWidth - cropX);
        const cropHeight = Math.min(area.height, pageHeight - cropY);

        console.log(
          `Setting crop box: x=${cropX}, y=${cropY}, w=${cropWidth}, h=${cropHeight}`,
        );

        // Set the crop box (this defines the visible area)
        const cropBox: [number, number, number, number] = [
          cropX,
          cropY,
          cropWidth,
          cropHeight,
        ];
        copiedPage.setCropBox(...cropBox);

        // Set the media box to match the crop box
        copiedPage.setMediaBox(...cropBox);
      }

      // Save the cropped PDF
      const croppedPdfBytes = await croppedPdf.save();
      console.log(`Cropped PDF saved, size: ${croppedPdfBytes.length} bytes`);

      // Convert to base64 for response
      return Buffer.from(croppedPdfBytes).toString("base64");
    } catch (error) {
      console.error("Error cropping PDF:", error);
      throw new Error(
        `Failed to crop PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getPageDimensions(
    page: number,
  ): Promise<{ width: number; height: number }> {
    if (!this.pdfDoc) {
      throw new Error("PDF not loaded. Call loadPDF() first.");
    }

    try {
      const pdfPage = await this.pdfDoc.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1.0 });

      return {
        width: viewport.width,
        height: viewport.height,
      };
    } catch (error) {
      console.error("Error getting page dimensions:", error);
      throw new Error(
        `Failed to get page dimensions: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getTotalPages(): Promise<number> {
    if (!this.pdfDoc) {
      throw new Error("PDF not loaded. Call loadPDF() first.");
    }

    return this.pdfDoc.numPages;
  }
}

// Utility function to expand search area around text
export function expandSearchArea(
  match: TextMatch,
  padding: number = 10,
): CropArea {
  // Calculate padding based on font size for better results
  const fontSizeBasedPadding = Math.max(padding, match.fontSize * 0.5);

  return {
    x: Math.max(0, match.x - fontSizeBasedPadding),
    y: Math.max(0, match.y - fontSizeBasedPadding),
    width: match.width + fontSizeBasedPadding * 2,
    height: match.height + fontSizeBasedPadding * 2,
    page: match.page,
  };
}

// Utility function to find text and return crop areas
export async function findTextAndGetCropAreas(
  pdfBuffer: string,
  searchText: string,
  padding: number = 10,
): Promise<{ matches: TextMatch[]; cropAreas: CropArea[] }> {
  try {
    const processor = new PDFProcessor();
    await processor.loadPDF(pdfBuffer);

    const matches = await processor.findTextInstances(searchText);
    const cropAreas = matches.map((match) => expandSearchArea(match, padding));

    return { matches, cropAreas };
  } catch (error) {
    console.error("Error in findTextAndGetCropAreas:", error);
    throw error;
  }
}
