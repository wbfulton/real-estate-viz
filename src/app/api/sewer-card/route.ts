import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SewerCardResponse {
  sscMaxX: number;
  sscMaxY: number;
  sscMinX: number;
  sscMinY: number;
  sscName: string;
  sscPathBack: string;
  sscPathFront: string;
  sscPrimaryCard: boolean;
}

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
      `https://maps.seattle.gov/gisapi/sdcisidesewercardservice/sidesewercard/getSideSewerCardsByParcel?pin=${parcelId}`,
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

    const data: SewerCardResponse[] = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No sewer card found" },
        { status: 404 },
      );
    }

    const primaryCard = data.find((card) => card.sscPrimaryCard);
    const secondaryCard = data.find((card) => !card.sscPrimaryCard);

    const jpgUrl = `https://dpddata1.seattle.gov/dpd/Apps/${primaryCard?.sscPathFront || secondaryCard?.sscPathFront}`;

    // Fetch the JPG file
    const jpgResponse = await fetch(jpgUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!jpgResponse.ok) {
      throw new Error(`Failed to fetch JPG: ${jpgResponse.status}`);
    }

    const jpgBuffer = await jpgResponse.arrayBuffer();

    // Return the JPG as a downloadable file
    return new NextResponse(jpgBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="sewer-card-front-${parcelId}.jpg"`,
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
