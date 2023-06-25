import { useState } from "react";

/**
 * This is the UX component for file upload. Does not contain any logic to handle the files, just triggers a callback with the FileList instead.
 *
 * The callback should accept an error handler to pass an error message to FileUpload that can then be shown to the user.
 */
export function FileUpload(props: FileUploadProps) {
  const [error, setError] = useState("");

  const localFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    props.fileHandler(files, setError);
  };

  return (
    <>
      <input
        type="file"
        name="file"
        accept=".json"
        multiple
        style={{ display: "block", margin: "10px auto" }}
        onChange={localFileHandler}
      />
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
    fl: FileList | null,
    errorHandler: (err: string) => void
  ) => void;
};
