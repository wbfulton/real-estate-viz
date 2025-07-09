import { findTextAndGetCropAreas, PDFProcessor } from "@/lib/pdf-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ProcessRequest {
  pdfBuffer: string;
  searchText: string;
  padding?: number;
  cropOnly?: boolean;
  returnCoordinates?: boolean;
}

interface ProcessResponse {
  totalMatches: number;
  pages: number;
  matches?: Array<{
    text: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
  }>;
  cropAreas?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }>;
  croppedPdf?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      pdfBuffer,
      searchText,
      padding = 10,
      cropOnly = false,
      returnCoordinates = true,
    }: ProcessRequest = await request.json();

    if (!pdfBuffer || !searchText) {
      console.error("PDF buffer and search text are required");
      return NextResponse.json(
        { error: "PDF buffer and search text are required" },
        { status: 400 },
      );
    }

    // Use the actual PDF processing utilities
    const { matches, cropAreas } = await findTextAndGetCropAreas(
      pdfBuffer,
      searchText,
      padding,
    );

    if (matches.length === 0) {
      console.error("No text matches found");
      return NextResponse.json({
        message: "No text matches found",
        matches: [],
        totalMatches: 0,
        pages: 1,
      });
    }

    const response: ProcessResponse = {
      totalMatches: matches.length,
      pages: 1,
    };

    if (returnCoordinates) {
      response.matches = matches;
      response.cropAreas = cropAreas;
    }

    if (cropOnly && cropAreas.length > 0) {
      console.log("Cropping PDF");
      // Actually crop the PDF using the PDFProcessor
      const processor = new PDFProcessor();
      await processor.loadPDF(pdfBuffer);
      const croppedPdfBase64 = await processor.cropPDF(cropAreas);
      response.croppedPdf = croppedPdfBase64;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint for testing with a sample PDF
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parcelId = searchParams.get("parcelId");
  const searchText = searchParams.get("searchText");

  if (!parcelId || !searchText) {
    return NextResponse.json(
      { error: "Parcel ID and search text are required" },
      { status: 400 },
    );
  }

  try {
    // First, get the PDF from the property endpoint
    const propertyResponse = await fetch(
      `${request.nextUrl.origin}/api/property?parcelId=${parcelId}`,
    );

    if (!propertyResponse.ok) {
      throw new Error(
        `Failed to fetch property PDF: ${propertyResponse.status}`,
      );
    }

    const pdfBuffer = await propertyResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    // Use the actual PDF processing utilities
    const { matches, cropAreas } = await findTextAndGetCropAreas(
      pdfBase64,
      searchText,
      10, // Default padding
    );

    return NextResponse.json({
      parcelId,
      searchText,
      matches,
      cropAreas,
      totalMatches: matches.length,
    });
  } catch (error) {
    console.error("Error processing property PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to process property PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
