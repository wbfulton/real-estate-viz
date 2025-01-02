"use client";

import type { Feature } from "geojson";
import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import { PropertiesList } from "./components/PropertiesList";
import { UploadCSVButton } from "./components/UploadCSVButton";
import { data } from "./data";
import {
  PapaCSVResponse,
  parseRealEstateCSV,
  ProjectStatus,
  ProjectStatusColor,
  ProjectType,
  ProjectTypeIcon,
  Property,
} from "./utils";

export default function Home() {
  const [csvData, setCSVData] = useState<Property[] | undefined>(data);

  const geojsonProperties: Feature[] = [];

  csvData?.forEach((prop) => {
    if (prop.lat && prop.lon) {
      const data: Feature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [prop.lon, prop.lat] },
        properties: [],
      };

      geojsonProperties.push(data);
    }
  });

  // const geojson: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       geometry: { type: "Point", coordinates: [-122.325989, 47.648071] },
  //       properties: [],
  //     },
  //     ...geojsonProperties,
  //   ],
  // };

  return (
    <div
      className="align-center flex h-screen max-h-screen w-full flex-col justify-center
        overflow-hidden">
      <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.9.1/mapbox-gl.css"
        rel="stylesheet"
      />
      <nav
        className="z-50 flex w-full items-center justify-between gap-2 bg-transparent px-6 py-2
          text-center">
        <div className="flex w-full items-center justify-between gap-2">
          Tristan Real Estate Tool
          <UploadCSVButton
            onUploadAccepted={(results: PapaCSVResponse) => {
              setCSVData(parseRealEstateCSV(results));
            }}
            onFileRemove={() => {
              setCSVData(undefined);
            }}
          />
        </div>
      </nav>
      <main className="flex flex-1 flex-col overflow-hidden px-6 py-2">
        <h1 className="py-2 text-xl">All Listings</h1>
        <div className="flex flex-1 overflow-hidden">
          <div className="max-h-full w-2/5 overflow-scroll">
            <PropertiesList csvData={csvData} />
          </div>
          <div className="w-3/5 px-4">
            <Map
              mapboxAccessToken="pk.eyJ1Ijoid2JmdWx0b24iLCJhIjoiY2s5MjQzazRsMDRrYTNucGFpdnkzZW5ncSJ9.tsiPUzDPzk4QEsIFCxlxjA"
              initialViewState={{
                longitude: -122.325989,
                latitude: 47.648071,
                zoom: 9.5,
              }}
              style={{ width: 600, height: 500 }}
              mapStyle="mapbox://styles/mapbox/streets-v9">
              {data?.map((propData, i) => {
                if (
                  propData.lat === undefined ||
                  propData.lon === undefined ||
                  propData.projectType === undefined
                ) {
                  return null;
                }

                const Icon =
                  ProjectTypeIcon[propData.projectType as ProjectType];

                const color =
                  ProjectStatusColor[propData.projectStatus as ProjectStatus];

                return (
                  <Marker
                    key={"marker-" + i}
                    longitude={propData.lon}
                    latitude={propData.lat}
                    className="rounded-md bg-background">
                    <Icon className="h-5 w-5" color={color} />
                  </Marker>
                );
              })}
            </Map>
          </div>
        </div>
      </main>
      <footer
        className="absolute bottom-0 right-0 z-50 flex flex-wrap items-center justify-center
          bg-transparent p-2">
        Created by Former Go-Globalers
      </footer>
    </div>
  );
}
