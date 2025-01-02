import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core-ui";

import { ChevronRight } from "lucide-react";
import { doubleToCurrency, Property } from "../utils";

export const PropertiesList = ({ csvData }: { csvData?: Property[] }) => {
  if (csvData === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {csvData?.map((data, i) => {
        return (
          <Card key={"property-" + i} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="w-8/12">
                  {data.nickname ?? data.neighborhood ?? data.builderName}
                </CardTitle>
                <CardDescription className="w-4/12 break-all text-right">
                  <span>{`${data.projectStatus}`}</span>
                </CardDescription>
              </div>
              <CardDescription className="flex justify-between">
                <span>{`${data.streetAddress}`}</span>
                <span className="text-right">{`${data.numAvailableUnits} / ${data.numUnits} Units Available`}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-0 pt-1">
              <Collapsible className={"group/collapsible hover:cursor-pointer"}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-fit items-center p-1">
                    <span>Details</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200
                      group-data-[state=open]/collapsible:rotate-90`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="grid grid-flow-row grid-cols-2 gap-y-2 px-1 py-2 text-sm">
                  <div>
                    <p className="text-xs">Builder Name</p>
                    <p className="font-medium">{data.builderName}</p>
                  </div>
                  <div>
                    <p className="text-xs">Avg Est. List Price</p>
                    <p className="font-medium">
                      {doubleToCurrency(data.avgEstListPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">Last Modified</p>
                    <p className="font-medium">
                      {data.dateLastModified.toLocaleDateString()}
                    </p>
                  </div>
                  {data.projectType && (
                    <div>
                      <p className="text-xs">Project Type</p>
                      <p className="font-medium">{data.projectType}</p>
                    </div>
                  )}
                  {data.neighborhood && (
                    <div>
                      <p className="text-xs">Neighborhood</p>
                      <p className="font-medium">{data.neighborhood}</p>
                    </div>
                  )}
                  {data.estCompletionDate && (
                    <div>
                      <p className="text-xs">Est. Completion Date</p>
                      <p className="font-medium">
                        {data.estCompletionDate.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {data.isPresaleFriendly !== undefined && (
                    <div>
                      <p className="text-xs">Is Presale Friendly</p>
                      <p className="font-medium">
                        {data.isPresaleFriendly ? "Yes" : "No"}
                      </p>
                    </div>
                  )}
                  {data.isAlchemyListing !== undefined && (
                    <div>
                      <p className="text-xs">Is Alchemy Listing</p>
                      <p className="font-medium">
                        {data.isAlchemyListing ? "Yes" : "No"}
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
