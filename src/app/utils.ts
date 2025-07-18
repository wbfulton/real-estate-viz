import {
  Handshake,
  Home,
  HousePlus,
  LucideProps,
  School,
  StoreIcon,
  Tent,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface PapaCSVResponse {
  data: Array<string | undefined[]>;
  errors: {
    type: string; // A generalization of the error
    code: string; // Standardized error code
    message: string; // Human-readable details
    row: number; // Row index of parsed data where error is
  }[];
  meta: {
    delimiter: unknown; // Delimiter used
    linebreak: unknown; // Line break sequence used
    aborted: unknown; // Whether process was aborted
    fields: unknown; // Array of field names
    truncated: unknown; // Whether preview consumed all input
  }[];
}

export type LucideIcon = ForwardRefExoticComponent<
  LucideProps & RefAttributes<SVGSVGElement>
>;

export interface Property {
  id: number;
  nickname?: string;
  builderName: string;
  projectType?: ProjectType;
  streetAddress: string;
  neighborhood?: string;
  estCompletionDate?: Date;
  isPresaleFriendly?: boolean;
  avgEstListPrice: number;
  numUnits: number;
  numAvailableUnits: number;
  projectStatus: ProjectStatus;
  isAlchemyListing: boolean;
  dateLastModified: Date;
  lat?: number;
  lon?: number;
}

export enum ProjectStatus {
  PERMIT_PENDING = "Permit Pending",
  PERMIT_ISSUED = "Permit Issued",
  FOUNDATION = "Foundation",
  FRAMING = "Framing",
  ROUGH_INS = "Rough Ins",
  SHEETROCK = "Sheetrock",
  FINISHES = "Finishes",
  COMPLETED = "Completed",
}

const projectListingOrder = [
  ProjectStatus.PERMIT_PENDING,
  ProjectStatus.PERMIT_ISSUED,
  ProjectStatus.FOUNDATION,
  ProjectStatus.FRAMING,
  ProjectStatus.ROUGH_INS,
  ProjectStatus.SHEETROCK,
  ProjectStatus.FINISHES,
  ProjectStatus.COMPLETED,
];

// https://cssgradient.io/
export const ProjectStatusColor: { [key in ProjectStatus]: string } = {
  [ProjectStatus.PERMIT_PENDING]: "#c80000",
  [ProjectStatus.PERMIT_ISSUED]: "#ba1600",
  [ProjectStatus.FOUNDATION]: "#a43800",
  [ProjectStatus.FRAMING]: "#915600",
  [ProjectStatus.ROUGH_INS]: "#846a00",
  [ProjectStatus.SHEETROCK]: "#59ae00",
  [ProjectStatus.FINISHES]: "#89bc06",
  [ProjectStatus.COMPLETED]: "#49c800",
};

export enum ProjectType {
  EXISTING_RESALE = "Existing Re-sale",
  LIVE_WORK = "Live/Work",
  SINGLE_FAMILY = "Single Family",
  TOWNHOUSE = "Townhouse",
  COTTAGE = "Cottage",
  SFR_ADU_DADU = "SFR / ADU / DADU",
}

export const ProjectTypeIcon: { [key in ProjectType]: LucideIcon } = {
  [ProjectType.EXISTING_RESALE]: Handshake,
  [ProjectType.LIVE_WORK]: StoreIcon,
  [ProjectType.SINGLE_FAMILY]: Home,
  [ProjectType.TOWNHOUSE]: School,
  [ProjectType.COTTAGE]: Tent,
  [ProjectType.SFR_ADU_DADU]: HousePlus,
};

// PDF Analysis Utilities
export interface PDFAnalysisResult {
  matches: Array<{
    text: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
  }>;
  cropAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }>;
  totalMatches: number;
}

export const analyzePropertyPDF = async (
  parcelId: string,
  searchText: string,
): Promise<PDFAnalysisResult> => {
  const response = await fetch(
    `/api/pdf-process?parcelId=${encodeURIComponent(parcelId)}&searchText=${encodeURIComponent(searchText)}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return await response.json();
};

export const downloadPropertyPDF = async (parcelId: string): Promise<void> => {
  const response = await fetch(`/api/property?parcelId=${parcelId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `property-${parcelId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const downloadCroppedPDF = async (
  parcelId: string,
  searchText: string,
  padding: number = 20,
): Promise<void> => {
  // First get the PDF
  const pdfResponse = await fetch(`/api/property?parcelId=${parcelId}`);
  if (!pdfResponse.ok) {
    throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

  // Then crop it using the actual cropping functionality
  const cropResponse = await fetch("/api/pdf-process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pdfBuffer: pdfBase64,
      searchText,
      padding,
      cropOnly: true,
      returnCoordinates: false,
    }),
  });

  if (!cropResponse.ok) {
    throw new Error(`Failed to crop PDF: ${cropResponse.status}`);
  }

  const cropData = await cropResponse.json();

  if (cropData.croppedPdf) {
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
  } else {
    throw new Error("No cropped PDF data received");
  }
};

// Common search terms for property documents
export const COMMON_PROPERTY_SEARCH_TERMS = [
  "Address",
  "Owner",
  "Assessed Value",
  "Property Type",
  "Square Footage",
  "Year Built",
  "Lot Size",
  "Zoning",
  "Tax Amount",
  "Legal Description",
];

export const parseRealEstateCSV = (csvRes: PapaCSVResponse): Property[] => {
  if (csvRes.errors.length > 0) {
    return [];
  }
  //   const headers = csvRes.data[0];
  const properties: Property[] = [];
  csvRes.data.forEach((csvProperty, i) => {
    if (i !== 0) {
      const avgEstListPrice = csvProperty[7]
        ? convertCurrencyToDouble(csvProperty[7])
        : 0.0;

      const nickname =
        csvProperty[0] === "" || csvProperty[0] === undefined
          ? undefined
          : csvProperty[0];

      const neighborhood =
        csvProperty[4] === "" || csvProperty[4] === undefined
          ? undefined
          : csvProperty[4];

      const projectType =
        csvProperty[2] === "" || csvProperty[2] === undefined
          ? undefined
          : (csvProperty[2] as ProjectType);

      const isPresaleFriendly =
        csvProperty[6] === "" || csvProperty[6] === undefined
          ? undefined
          : Boolean(csvProperty[2]);

      const completionDateStr =
        csvProperty[5] === "" || csvProperty[5] === undefined
          ? undefined
          : csvProperty[5]?.split("/");
      const estCompletionDate =
        completionDateStr !== undefined
          ? new Date(
              Number(completionDateStr[2]),
              Number(completionDateStr[0]),
              Number(completionDateStr[1]),
            )
          : completionDateStr;

      const property: Property = {
        id: i,
        nickname: nickname,
        builderName: csvProperty[1] ?? "",
        projectType,
        streetAddress: csvProperty[3] ?? "",
        neighborhood,
        estCompletionDate,
        isPresaleFriendly,
        avgEstListPrice,
        numUnits: Number(csvProperty[8]),
        numAvailableUnits: Number(csvProperty[9]),
        projectStatus: csvProperty[10] as ProjectStatus,
        isAlchemyListing: Boolean(csvProperty[11]),
        dateLastModified: new Date(csvProperty[12] ?? ""),
        lat:
          csvProperty[13] !== undefined ? Number(csvProperty[13]) : undefined,
        lon:
          csvProperty[14] !== undefined ? Number(csvProperty[14]) : undefined,
      };

      properties.push(property);
    }
  });

  properties.sort((a, b) => {
    // Status
    const statusSort =
      projectListingOrder.findIndex((val) => val === b.projectStatus) -
      projectListingOrder.findIndex((val) => val === a.projectStatus);

    if (statusSort == 0) {
      // Units Available
      return b.numAvailableUnits - a.numAvailableUnits;
    }

    return statusSort;
  });

  return properties;
};

// Function to convert currency string to double using
const convertCurrencyToDouble = (
  currency: string,
  //   locale: string = "en-US",
  //   currencyType: string = "USD",
) => {
  // Creating a NumberFormat object with specified locale and currency
  //   const formatter = new Intl.NumberFormat(locale, {
  //     style: "currency",
  //     currency: currencyType,
  //     currencyDisplay: "symbol",
  //   });

  // Formatting the currency to remove any non-numeric characters except for decimal point
  const normalizedCurrency = currency.replace(/[^\d.-]+/g, "");

  // Converting the normalized string to a double value using Number constructor
  const doubleValue = Number(normalizedCurrency);

  // Returning the double value
  return doubleValue;
};

export const doubleToCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
