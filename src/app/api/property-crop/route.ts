import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parcelId = searchParams.get("parcelId");

  if (!parcelId) {
    return NextResponse.json(
      { error: "Parcel ID is required" },
      { status: 400 },
    );
  }

  try {
    // Make the request server-side to avoid CORS issues
    const response = await fetch(
      `https://info.kingcounty.gov/assessor/emap/default.aspx?ParcelNbr=${parcelId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    const tableIndex = html.indexOf(
      "https://aqua.kingcounty.gov/assessor/emap/InternetPDF/",
    );

    if (tableIndex === -1) {
      throw new Error("PDF link not found in the response");
    }

    const after = html.substring(tableIndex);
    const endIndex = after.indexOf(".pdf");

    if (endIndex === -1) {
      throw new Error("PDF link is incomplete");
    }

    const pdfUrl = after.substring(0, endIndex + 4);

    // Fetch the PDF file
    const pdfResponse = await fetch(pdfUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="property-${parcelId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching property data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch property data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
