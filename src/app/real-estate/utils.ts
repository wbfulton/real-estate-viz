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

export interface Property {
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

export enum ProjectType {
  EXISTING_RESALE = "Existing Re-sale",
  LIVE_WORK = "Live/Work",
  SINGLE_FAMILY = "Single Family",
  TOWNHOUSE = "Townhouse",
  COTTAGE = "Cottage",
  SFR_ADU_DADU = "SFR / ADU / DADU",
}

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

export const doubleToCurrency = (
  number: number,
  locale: string = "en-US",
  currencyType: string = "USD",
) => {
  //   Creating a NumberFormat object with specified locale and currency
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyType,
    currencyDisplay: "symbol",
  });

  return formatter.format(number);
};
