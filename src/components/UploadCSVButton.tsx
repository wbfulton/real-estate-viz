import { Button } from "@/core-ui";
import { Upload, X } from "lucide-react";
import { CSSProperties, useMemo } from "react";
import { useCSVReader } from "react-papaparse";
import { PapaCSVResponse } from "../app/utils";

const styles = {
  progressBarBackgroundColor: {
    backgroundColor: "blue",
  } as CSSProperties,
};

// ENABLE DRAGGING TOO
export const UploadCSVButton = ({
  onUploadAccepted,
  onFileRemove,
}: {
  onUploadAccepted: (results: PapaCSVResponse) => void;
  onFileRemove: () => void;
}) => {
  const { CSVReader } = useCSVReader();

  const uploadButtonText = useMemo(
    () => (
      <>
        <Upload />
        Upload CSV
      </>
    ),
    [],
  );

  // onUploadRejected
  // validator

  return (
    <CSVReader
      onUploadAccepted={onUploadAccepted}
      onUploadRejected={() => {
        onFileRemove();
      }}>
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      }) => {
        const removeFileButtonText = (
          <>
            <X />
            {`Clear ${acceptedFile && acceptedFile.name}`}
          </>
        );

        const papaProps = acceptedFile ? getRemoveFileProps() : getRootProps();

        return (
          <div className="w-max">
            <Button
              {...papaProps}
              variant={"secondary"}
              size={"sm"}
              onClick={(e: Event) => {
                onFileRemove();
                papaProps?.onClick(e);
              }}>
              {acceptedFile ? removeFileButtonText : uploadButtonText}
            </Button>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </div>
        );
      }}
    </CSVReader>
  );
};
