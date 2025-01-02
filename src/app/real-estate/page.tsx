"use client";

import { useState } from "react";
import { PropertiesList } from "./components/PropertiesList";
import { UploadCSVButton } from "./components/UploadCSVButton";
import { PapaCSVResponse, parseRealEstateCSV, Property } from "./utils";

export default function Home() {
  const [csvData, setCSVData] = useState<Property[]>();

  console.log(csvData);

  return (
    <div
      className="align-center flex h-screen max-h-screen w-full flex-col justify-center
        overflow-hidden">
      <nav
        className="z-50 flex w-full items-center justify-between gap-2 bg-transparent px-6 py-2
          text-center text-xs">
        <div className="flex w-full items-center justify-between gap-2">
          Nav
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
      <main className="flex flex-1 overflow-hidden px-6 py-2">
        <div className="max-h-full w-2/5 overflow-scroll">
          <h1 className="py-2 text-xl">All Listings</h1>
          <PropertiesList csvData={csvData} />
        </div>
        <div className="w-3/5 px-4">Hello</div>
      </main>
      <footer
        className="absolute bottom-0 right-0 z-50 flex flex-wrap items-center justify-center
          bg-transparent p-2">
        Created by Former Go-Globalers
      </footer>
    </div>
  );
}
