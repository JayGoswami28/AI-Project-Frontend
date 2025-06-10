
import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFiles: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, acceptedFiles }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (acceptedFiles.length + files.length > 10) {
      setError('Maximum 10 files allowed.');
      return;
    }

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not a supported file type. Please upload PDF or DOC files only.`);
        return;
      }
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Maximum file size is 5MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setError('');
      onFilesSelected([...acceptedFiles, ...validFiles]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFiles(e.dataTransfer.files);
    }
  }, [acceptedFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = acceptedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
    setError('');
  };

  return (
    <div className="mb-4">
      <label htmlFor="resumeUpload" className="form-label fw-semibold">
        Upload Resumes <span className="text-danger">*</span>
      </label>
      
      <div
        className={`file-upload-zone p-4 text-center position-relative ${
          dragActive ? 'drag-active' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="resumeUpload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="position-absolute w-100 h-100 opacity-0"
          style={{ top: 0, left: 0, cursor: 'pointer' }}
        />
        
        <Upload size={48} className="upload-icon mb-3" />
        <h5 className="mb-2 fw-semibold">Drag and drop resumes here</h5>
        <p className="text-muted mb-2">or click to browse</p>
        <small className="text-muted">
          <strong>Supported formats:</strong> PDF, DOC, DOCX (Max 5MB each, 10 files total)
        </small>
      </div>

      {error && (
        <div className="alert alert-danger mt-2 fade-in-up" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {acceptedFiles.length > 0 && (
        <div className="mt-3 fade-in-up">
          <div className="d-flex align-items-center mb-3">
            <CheckCircle size={20} className="text-success me-2" />
            <h6 className="mb-0 fw-semibold">Uploaded Files ({acceptedFiles.length})</h6>
          </div>
          <div className="row">
            {acceptedFiles.map((file, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-2">
                <div className="card border-success border-opacity-25 shadow-sm">
                  <div className="card-body p-3 d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '35px',
                        height: '35px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      }}
                    >
                      <FileText size={16} className="text-white" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-truncate small" title={file.name}>
                        {file.name}
                      </div>
                      <small className="text-muted">
                        {(file.size / 1024).toFixed(1)} KB
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => removeFile(index)}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
