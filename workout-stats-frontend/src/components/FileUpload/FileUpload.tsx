import { useEffect, useState } from "react";
import "./FileUpload.css";
import BarLoader from "react-spinners/BarLoader";

/**
 * This is the UX component for file upload. Does not contain any logic to handle the files, just triggers a callback with the FileList instead.
 *
 * The callback should accept success and error handlers to pass an error message to FileUpload that can then be shown to the user.
 */
export function FileUpload(props: FileUploadProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputComponentId = `file-upload-${Math.floor(Math.random() * 100000)}`;

  const successHandler = () => {
    setUploading(false);
    setSuccess(true);
    setError("");
  };

  const errorHandler = (e: string) => {
    setUploading(false);
    setSuccess(false);
    setError(e);
  };

  const localFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setUploading(true);
    props.fileHandler(files, successHandler, errorHandler);
  };

  const localDropHandler = (event: React.DragEvent) => {
    event.preventDefault();
    if (uploading) return;

    if (event.dataTransfer.items) {
      const files = Array.from(event.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((item) => !!item);
      setUploading(true);
      props.fileHandler(files as File[], successHandler, errorHandler);
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
          disabled={uploading}
        />
        {uploading && <BarLoader />}
      </label>
      {error && (
        <div className="text-[#b91c1c] mt-3">
          There was an issue uploading the files.
          <p>Error message: {error}</p>
        </div>
      )}
      {success && <div className="text-emerald-500 mt-3">Files uploaded!</div>}
    </>
  );
}

type FileUploadProps = {
  fileHandler: (
    fl: FileList | null | File[],
    successHandler: () => void,
    errorHandler: (err: string) => void
  ) => void;
};
