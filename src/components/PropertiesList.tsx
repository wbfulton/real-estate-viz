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

import { cn } from "@/lib";
import { ChevronRight, Map } from "lucide-react";
import { useEffect } from "react";
import { doubleToCurrency, Property } from "../app/utils";

export const PropertiesList = ({
  csvData,
  selectedId,
  setSelectedId,
}: {
  csvData?: Property[];
  selectedId?: number;
  setSelectedId: (selectedId: number) => void;
}) => {
  useEffect(() => {
    if (selectedId) {
      const element = document.getElementById(selectedId + "");
      element?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedId]);

  if (csvData === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {csvData?.map((data, i) => {
        const selectedStyle =
          selectedId === data.id ? "border-primary bg-background/80" : "";

        return (
          <Card
            id={data.id + ""}
            key={"property-" + i}
            className={cn("w-full", selectedStyle)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="w-8/12">
                  {data.nickname ?? "No Nickname"}
                </CardTitle>
                <CardDescription className="flex w-4/12 items-center justify-between text-right">
                  <Button
                    variant={"ghost"}
                    onClick={() => setSelectedId(data.id)}>
                    <Map size={20} />
                  </Button>
                  <span>{`${data.projectStatus}`}</span>
                </CardDescription>
              </div>
              <CardDescription className="flex justify-between">
                <span>{`${data.streetAddress}`}</span>
                <span className="text-right">{`${data.numAvailableUnits} / ${data.numUnits} Units Available`}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-0 pt-1">
              <Collapsible className={"group/collapsible"}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-fit items-center p-1 hover:cursor-pointer">
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
