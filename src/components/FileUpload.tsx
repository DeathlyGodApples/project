import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const FileUpload = ({
  onFileUpload,
  accept,
  multiple,
}: {
  onFileUpload: (file: File) => void;
  accept: string;
  multiple: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false);
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`neumorph transition-all cursor-pointer hover:shadow-neumorph-lg ${
        isDragging ? 'neumorph-pressed' : ''
      }`}
    >
      <input {...getInputProps()} />
      <div className="p-8 text-center space-y-3">
        <UploadCloud
          className={`mx-auto h-12 w-12 ${
            isDragging ? 'text-accent-blue' : 'text-matte-400'
          }`}
        />
        <div className="space-y-1">
          <p className="text-sm font-medium text-matte-700">
            {isDragging ? 'Drop file here' : 'Drag and drop or click to upload'}
          </p>
          <p className="text-xs text-matte-500">PDF files only</p>
        </div>
      </div>
    </div>
  );
};