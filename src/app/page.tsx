"use client";

import { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup, ScaleControl, useMap } from "react-map-gl";
import { PropertiesList } from "./components/PropertiesList";
import { UploadCSVButton } from "./components/UploadCSVButton";
import {
  PapaCSVResponse,
  parseRealEstateCSV,
  ProjectStatus,
  ProjectStatusColor,
  ProjectType,
  ProjectTypeIcon,
  Property,
} from "./utils";

const FlyTo = ({ selectedProperty }: { selectedProperty?: Property }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (
      map !== undefined &&
      selectedProperty?.lat !== undefined &&
      selectedProperty.lon !== undefined
    ) {
      map?.flyTo({
        center: [selectedProperty.lon, selectedProperty?.lat],
        zoom: 15,
      });
    }
  }, [map, selectedProperty]);

  return null;
};

export default function Home() {
  const [csvData, setCSVData] = useState<Property[] | undefined>();
  const [hoveredId, setHoveredId] = useState<number | undefined>();
  const [selectedId, setSelectedId] = useState<number | undefined>();

  // HTML Render
  // Source + Layer flow is more performant
  const markers = useMemo(
    () =>
      csvData?.map((propData, i) => {
        if (
          propData.lat === undefined ||
          propData.lon === undefined ||
          propData.projectType === undefined
        ) {
          return null;
        }

        const Icon = ProjectTypeIcon[propData.projectType as ProjectType];

        const color =
          ProjectStatusColor[propData.projectStatus as ProjectStatus];

        return (
          <Marker
            key={"marker-" + i}
            longitude={propData.lon}
            latitude={propData.lat}
            className="rounded-md bg-background hover:cursor-pointer"
            onClick={() => setSelectedId(propData.id)}>
            <Icon
              className="h-5 w-5"
              color={color}
              onMouseEnter={() => {
                setHoveredId(propData.id);
              }}
              onMouseLeave={() => {
                setHoveredId(undefined);
              }}
            />
          </Marker>
        );
      }),
    [csvData],
  );

  const hoveredProperty = useMemo(() => {
    return csvData?.filter((data) => data.id === hoveredId)?.[0];
  }, [csvData, hoveredId]);

  const selectedProperty = useMemo(() => {
    return csvData?.filter((data) => data.id === selectedId)?.[0];
  }, [csvData, selectedId]);

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
            <PropertiesList
              csvData={csvData}
              selectedId={selectedId}
              setSelectedId={(selectedId: number) => setSelectedId(selectedId)}
            />
          </div>
          <div className="w-3/5 px-4">
            <Map
              mapboxAccessToken="pk.eyJ1Ijoid2JmdWx0b24iLCJhIjoiY2s5MjQzazRsMDRrYTNucGFpdnkzZW5ncSJ9.tsiPUzDPzk4QEsIFCxlxjA"
              initialViewState={{
                longitude: -122.325989,
                latitude: 47.648071,
                zoom: 9.5,
              }}
              style={{ width: 700, height: 550 }}
              mapStyle="mapbox://styles/mapbox/streets-v9">
              <ScaleControl />
              <FlyTo selectedProperty={selectedProperty} />
              {markers}
              {hoveredProperty?.lon && hoveredProperty?.lat && (
                <Popup
                  longitude={hoveredProperty.lon}
                  latitude={hoveredProperty.lat}
                  closeButton={false}
                  anchor="bottom"
                  offset={10}
                  onClose={() => setHoveredId(undefined)}>
                  <div className="font-semibold">
                    {hoveredProperty.nickname ??
                      hoveredProperty.neighborhood ??
                      hoveredProperty.builderName}
                  </div>
                  <div>{hoveredProperty.streetAddress}</div>
                  <div>{`${hoveredProperty.numAvailableUnits} / ${hoveredProperty.numUnits} Units Available`}</div>
                </Popup>
              )}
            </Map>
          </div>
        </div>
      </main>
      <footer
        className="absolute bottom-0 right-0 z-50 flex flex-wrap items-center justify-center
          bg-transparent p-2">
        Created by Ex-Go-Globalers
      </footer>
    </div>
  );
}
