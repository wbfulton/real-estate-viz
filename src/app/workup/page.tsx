"use client";

import Link from "next/link";
import { useState } from "react";

interface PropertyData {
  success: boolean;
  parcelId: string;
  link: string;
}

interface TextMatch {
  text: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

const EXAMPLE_PARCEL_ID = "2926049360";

/**
 * All components to generate a workup of a property
 */
export default function WorkupPage() {
  const [parcelId, setParcelId] = useState<string>(EXAMPLE_PARCEL_ID);
  const [loading, setLoading] = useState<boolean>(false);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PDF Analysis states
  const [searchText, setSearchText] = useState("");
  const [pdfAnalysis, setPdfAnalysis] = useState<{
    matches: TextMatch[];
    cropAreas: CropArea[];
    totalMatches: number;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // 1. Enter Parcel ID
  // 2. Hit https://info.kingcounty.gov/Assessor/eMap/Default.aspx
  // 3. Parse PDF
  // 4. Return screenshot of property

  // 2. https://info.kingcounty.gov/assessor/emap/default.aspx?ParcelNbr=2926049360
  // 3. Table, https://aqua.kingcounty.gov/assessor/emap/InternetPDF/qs_NE292604.pdf

  // OR

  // 2. https://blue.kingcounty.com/Assessor/eRealProperty/Detail.aspx?ParcelNbr=2926049360
  // 3. Quarter-Section-Township-Range, https://aqua.kingcounty.gov/assessor/emap/InternetPDF/qs_NE292604.pdf

  const getData = async (parcelId: string) => {
    setLoading(true);
    setError(null);
    setPropertyData(null);
    setPdfAnalysis(null);

    try {
      const response = await fetch(`/api/property?parcelId=${parcelId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is a PDF
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/pdf")) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `property-${parcelId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setPropertyData({
          success: true,
          parcelId,
          link: `PDF downloaded: property-${parcelId}.pdf`,
        });
      } else {
        // Handle JSON response (error case)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setPropertyData(data);
      }

      // Display the truncated HTML in the console for debugging
      if (propertyData?.link) {
        console.log("PDF link:", propertyData.link);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const analyzePDF = async () => {
    if (!parcelId.trim() || !searchText.trim()) {
      setError("Please enter both Parcel ID and search text");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setPdfAnalysis(null);

    try {
      const response = await fetch(
        `/api/pdf-process?parcelId=${encodeURIComponent(parcelId)}&searchText=${encodeURIComponent(searchText)}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      setPdfAnalysis(data);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadCroppedPDF = async () => {
    if (!pdfAnalysis || pdfAnalysis.matches.length === 0) {
      setError("No matches to crop");
      return;
    }

    try {
      setLoading(true);

      // Get the original PDF first
      const pdfResponse = await fetch(`/api/property?parcelId=${parcelId}`);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

      // Now crop the PDF
      const cropResponse = await fetch("/api/pdf-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfBuffer: pdfBase64,
          searchText: searchText,
          padding: 20,
          cropOnly: true,
          returnCoordinates: false,
        }),
      });

      if (!cropResponse.ok) {
        throw new Error(`Failed to crop PDF: ${cropResponse.status}`);
      }

      const cropData = await cropResponse.json();

      if (cropData.croppedPdf) {
        // Download the cropped PDF
        const blob = new Blob([Buffer.from(cropData.croppedPdf, "base64")], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cropped-${parcelId}-${searchText}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading cropped PDF:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to download cropped PDF",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelId.trim()) {
      getData(parcelId.trim());
    }
  };

  return (
    <div className="min-h-screen p-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Property Workup &amp; Analysis</h1>
        <p className="text-gray-600">
          Download property PDFs and extract specific information
        </p>
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Useful Links</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Parcel Number"
              className="flex-1 rounded-md border border-gray-300 p-2"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
            />
          </div>
        </form>

        <div className="mt-4 flex flex-col gap-2 rounded-md p-4">
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://info.kingcounty.gov/Assessor/eMap/Default.aspx?ParcelNbr=${parcelId}`}
            target="_blank">
            Plat Map
          </Link>
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://district-conditions-report.kingcounty.gov/?PIN=${parcelId}`}
            target="_blank">
            District Conditions Report
          </Link>
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr=${parcelId}`}
            target="_blank">
            eReal / Assessors Report
          </Link>
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://seattlecitygis.maps.arcgis.com/apps/webappviewer/index.html?id=f822b2c6498c4163b0cf908e2241e9c2`}
            target="_blank">
            Seattle GIS Map
          </Link>
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://experience.arcgis.com/experience/95749d0993164eefa99300182e99bd43#data_s=id%3AdataSource_7-1907b2a4913-layer-88-191fc1fccc8-layer-109%3A22352292`}
            target="_blank">
            Water & Sewer GIS Map
          </Link>
          <Link
            className="rounded-md px-4 py-2 hover:bg-gray-100"
            href={`https://maps.seattle.gov/sdcisidesewercardviewer/`}
            target="_blank">
            Seattle Sewer Card
          </Link>
        </div>
      </div>

      {/* PDF Download Section */}
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Plat Map</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Parcel ID"
              className="flex-1 rounded-md border border-gray-300 p-2"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-green-800 px-6 py-2 text-white hover:bg-green-900
                disabled:bg-gray-400">
              {loading ? "Downloading..." : "Download Cropped PDF"}
            </button>
          </div>
        </form>

        {propertyData && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <h3 className="font-medium text-green-800">Success!</h3>
            <p className="text-sm text-green-600">{propertyData.link}</p>
          </div>
        )}
      </div>

      {/* PDF Analysis Section */}
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Cropped Plat Map</h2>
        <p className="mb-4 text-sm text-gray-600">
          Search for specific text in the property PDF and get coordinates or
          download cropped sections
        </p>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="analysisParcelId"
              className="mb-1 block text-sm font-medium text-gray-700">
              Parcel ID
            </label>
            <input
              id="analysisParcelId"
              type="text"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="e.g., 2926049360"
            />
          </div>

          <div>
            <label
              htmlFor="searchText"
              className="mb-1 block text-sm font-medium text-gray-700">
              Search Text
            </label>
            <input
              id="searchText"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="e.g., Address, Owner, etc."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={analyzePDF}
            disabled={analyzing}
            className="rounded-md bg-green-500 px-6 py-2 text-white hover:bg-green-600
              disabled:bg-gray-400">
            {analyzing ? "Analyzing..." : "Analyze PDF"}
          </button>

          {pdfAnalysis && pdfAnalysis.matches.length > 0 && (
            <button
              onClick={downloadCroppedPDF}
              disabled={loading}
              className="rounded-md bg-purple-500 px-6 py-2 text-white hover:bg-purple-600
                disabled:bg-gray-400">
              {loading ? "Processing..." : "Download Cropped PDF"}
            </button>
          )}
        </div>

        {pdfAnalysis && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold">
              Analysis Results ({pdfAnalysis.totalMatches} matches found)
            </h3>

            {pdfAnalysis.matches.length === 0 ? (
              <p className="text-gray-500">No text matches found.</p>
            ) : (
              <div className="space-y-3">
                {pdfAnalysis.matches.map((match, index) => (
                  <div
                    key={index}
                    className="rounded border border-gray-200 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          Text: &ldquo;{match.text}&rdquo;
                        </p>
                        <p className="text-sm text-gray-600">
                          Page {match.page}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>X: {Math.round(match.x)}</p>
                        <p>Y: {Math.round(match.y)}</p>
                        <p>
                          Size: {Math.round(match.width)} ×{" "}
                          {Math.round(match.height)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      <p>
                        Crop Area: X=
                        {Math.round(pdfAnalysis.cropAreas[index].x)}, Y=
                        {Math.round(pdfAnalysis.cropAreas[index].y)}, W=
                        {Math.round(pdfAnalysis.cropAreas[index].width)}, H=
                        {Math.round(pdfAnalysis.cropAreas[index].height)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
