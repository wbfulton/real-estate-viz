"use client";

import Link from "next/link";
import { useState } from "react";

// Configure PDF.js worker

interface PropertyData {
  success: boolean;
  parcelId: string;
  link: string;
}

const EXAMPLE_PARCEL_ID = "2926049360";
// const EXAMPLE_SEARCH_TEXT = "9360";

/**
 * All components to generate a workup of a property
 */
export default function WorkupPage() {
  const [parcelId, setParcelId] = useState<string>(EXAMPLE_PARCEL_ID);
  const [loading, setLoading] = useState<boolean>(false);
  const [sewerCardLoading, setSewerCardLoading] = useState<boolean>(false);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [sewerCardData, setSewerCardData] = useState<PropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const getSewerCard = async (parcelId: string) => {
    setSewerCardLoading(true);
    setError(null);
    setSewerCardData(null);

    try {
      const response = await fetch(`/api/sewer-card?parcelId=${parcelId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is a JPG
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("image/jpeg")) {
        // Download the JPG
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sewer-card-front-${parcelId}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setSewerCardData({
          success: true,
          parcelId,
          link: `JPG downloaded: sewer-card-front-${parcelId}.jpg`,
        });
      } else {
        // Handle JSON response (error case)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSewerCardData(data);
      }

      // Display the truncated HTML in the console for debugging
      if (propertyData?.link) {
        console.log("JPG link:", propertyData.link);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setSewerCardLoading(false);
    }
  };

  const handleSewerCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelId.trim()) {
      getSewerCard(parcelId.trim());
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
              className="rounded-md bg-green-500 px-6 py-2 text-white hover:bg-green-600
                disabled:bg-gray-400">
              {loading ? "Downloading..." : "Download PDF"}
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

      {/* Sewer Card Download Section */}
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Sewer Card</h2>
        <form onSubmit={handleSewerCardSubmit} className="flex flex-col gap-4">
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
              disabled={sewerCardLoading}
              className="rounded-md bg-green-500 px-6 py-2 text-white hover:bg-green-600
                disabled:bg-gray-400">
              {sewerCardLoading ? "Downloading..." : "Download JPG"}
            </button>
          </div>
        </form>

        {sewerCardData && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <h3 className="font-medium text-green-800">Success!</h3>
            <p className="text-sm text-green-600">{sewerCardData.link}</p>
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
