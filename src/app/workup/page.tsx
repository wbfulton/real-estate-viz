"use client";

import { useState } from "react";

interface PropertyData {
  success: boolean;
  parcelId: string;
  link: string;
}

export default function WorkupPage() {
  const [parcelId, setParcelId] = useState("2926049360");
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelId.trim()) {
      getData(parcelId.trim());
    }
  };

  return (
    <div className="min-h-screen p-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Workup</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Parcel #"
          className="max-w-sm rounded-md border border-gray-300 p-2"
          value={parcelId}
          onChange={(e) => setParcelId(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="max-w-sm rounded-md bg-blue-500 p-2 text-white disabled:bg-gray-400">
          {loading ? "Loading..." : "Get Property PDF"}
        </button>
      </form>

      {error && (
        <div className="mt-4 max-w-sm rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {propertyData && (
        <div className="mt-6 max-w-4xl">
          <h2 className="mb-4 text-xl font-semibold">
            Property Data for Parcel {propertyData.parcelId}
          </h2>

          <div className="rounded-md bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Status:</h3>
            <p className="text-sm text-green-600">{propertyData.link}</p>
          </div>
        </div>
      )}
    </div>
  );
}
