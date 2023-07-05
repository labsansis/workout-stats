import { useState } from "react";
import "./FileUpload.css";

/**
 * This is the UX component for file upload. Does not contain any logic to handle the files, just triggers a callback with the FileList instead.
 *
 * The callback should accept an error handler to pass an error message to FileUpload that can then be shown to the user.
 */
export function FileUpload(props: FileUploadProps) {
  const [error, setError] = useState("");
  const inputComponentId = `file-upload-${Math.floor(Math.random() * 100000)}`;

  const localFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    props.fileHandler(files, setError);
  };

  const localDropHandler = (event: React.DragEvent) => {
    console.log("AAA");
    event.preventDefault();

    if (event.dataTransfer.items) {
      const files = Array.from(event.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((item) => !!item);
      props.fileHandler(files as File[], setError);
    }
  };

  return (
    <>
      <label
        htmlFor={inputComponentId}
        className="drop-container"
        id={`dropcontainer-${inputComponentId}`}
        onDrop={localDropHandler}
        onDragOver={(e) => e.preventDefault()}
      >
        <span className="drop-title">Drop files here</span>
        or
        <input
          type="file"
          name="file"
          accept=".json"
          multiple
          style={{ display: "block", margin: "10px auto" }}
          onChange={localFileHandler}
          id={inputComponentId}
        />
      </label>
      {error && (
        <div>
          There was an issue uploading the files.
          <p>Error message: {error}</p>
        </div>
      )}
    </>
  );
}

type FileUploadProps = {
  fileHandler: (
    fl: FileList | null | File[],
    errorHandler: (err: string) => void
  ) => void;
};
