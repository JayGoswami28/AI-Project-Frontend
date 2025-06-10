import React, { useState, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faFileAlt, 
  faSpinner, 
  faTimes, 
  faCheckCircle,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContainer';
import apiService from '../services/api';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, uploadResumes, setJobDescription, setJobTitle, setLoading, setError } = useApp();
  const { addToast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [jobDescriptionText, setJobDescriptionText] = useState(state.jobDescription);
  const [jobTitleText, setJobTitleText] = useState(state.jobTitle);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFiles = 10;
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['.pdf', '.doc', '.docx'];

  const validateFiles = useCallback((files: FileList): { validFiles: File[], errors: string[] } => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    Array.from(files).forEach((file, index) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        errors.push(`${file.name}: Invalid file type. Only PDF, DOC, and DOCX files are allowed`);
        return;
      }

      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds 5MB limit`);
        return;
      }

      if (index < maxFiles) {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach(error => {
        addToast({ type: 'error', message: error });
      });
      return;
    }

    setValidationErrors([]);
    
    try {
      await uploadResumes(validFiles);
      addToast({ 
        type: 'success', 
        message: `Successfully uploaded ${validFiles.length} resume(s)` 
      });
    } catch (error) {
      addToast({ 
        type: 'error', 
        message: 'Failed to upload resumes. Please try again.' 
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = state.resumes.filter((_, i) => i !== index);
    uploadResumes(newFiles.map(resume => resume.file));
  };

  const handleAnalyze = async () => {
    // Validation
    const errors: string[] = [];
    
    if (state.resumes.length === 0) {
      errors.push('Please upload at least one resume');
    }
    
    if (!jobDescriptionText.trim()) {
      errors.push('Please enter a job description');
    } else if (jobDescriptionText.trim().length < 50) {
      errors.push('Job description must be at least 50 characters long');
    } else if (jobDescriptionText.trim().length > 5000) {
      errors.push('Job description must be less than 5000 characters');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach(error => {
        addToast({ type: 'error', message: error });
      });
      return;
    }

    setValidationErrors([]);
    setLoading(true);
    setError(null);

    try {
      // Update context with current form values
      setJobDescription(jobDescriptionText);
      setJobTitle(jobTitleText);

      // For now, we'll navigate to results page
      // In a real implementation, this would call the API
      addToast({ 
        type: 'info', 
        message: 'Analyzing resumes... This may take a moment.' 
      });

      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        navigate('/results');
      }, 2000);

    } catch (error) {
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze resumes';
      setError(errorMessage);
      addToast({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Hire Smarter with AI-Powered Insights
                </h1>
                <p className="hero-subtitle">
                  Upload resumes, describe your ideal candidate, and let our AI rank the best matches in seconds
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="danger" className="mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <strong>Please fix the following issues:</strong>
                <ul className="mb-0 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Row>
              {/* File Upload Section */}
              <Col lg={6} className="mb-4">
                <Card className="custom-card h-100">
                  <Card.Header className="bg-gradient text-white">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faUpload} className="me-2" />
                      Upload Resumes
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div
                      className={`upload-card p-4 text-center mb-3 ${dragActive ? 'drag-over' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FontAwesomeIcon icon={faUpload} size="3x" className="text-muted mb-3" />
                      <h6>Drag & Drop Resumes Here</h6>
                      <p className="text-muted mb-3">
                        or click to browse files
                      </p>
                      <small className="text-muted">
                        Supports PDF, DOC, DOCX • Max {maxFiles} files • 5MB each
                      </small>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {/* Uploaded Files List */}
                    {state.resumes.length > 0 && (
                      <div>
                        <h6 className="mb-3">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                          Uploaded Files ({state.resumes.length})
                        </h6>
                        {state.resumes.map((resume, index) => (
                          <div key={index} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-2">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faFileAlt} className="text-primary me-2" />
                              <span className="small">{resume.file.name}</span>
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger p-1"
                              onClick={() => removeFile(index)}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Job Description Section */}
              <Col lg={6} className="mb-4">
                <Card className="custom-card h-100">
                  <Card.Header className="bg-gradient text-white">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                      Job Requirements
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">
                          Job Title (Optional)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control-modern"
                          placeholder="e.g., Senior React Developer"
                          value={jobTitleText}
                          onChange={(e) => setJobTitleText(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">
                          Job Description *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={8}
                          className="form-control-modern"
                          placeholder="Describe the role, required skills, experience level, and any specific qualifications..."
                          value={jobDescriptionText}
                          onChange={(e) => setJobDescriptionText(e.target.value)}
                          maxLength={5000}
                        />
                        <div className="d-flex justify-content-between mt-1">
                          <small className="text-muted">
                            Minimum 50 characters required
                          </small>
                          <small className="text-muted">
                            {jobDescriptionText.length}/5000
                          </small>
                        </div>
                      </Form.Group>

                      <Button
                        className="btn-gradient w-100"
                        size="lg"
                        onClick={handleAnalyze}
                        disabled={state.isLoading}
                      >
                        {state.isLoading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                            Analyzing Resumes...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Analyze Resumes
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Progress Bar */}
            {state.isLoading && (
              <Row className="mt-4">
                <Col>
                  <Card className="custom-card">
                    <Card.Body className="text-center">
                      <h6 className="mb-3">Processing your resumes...</h6>
                      <ProgressBar 
                        animated 
                        now={uploadProgress} 
                        className="progress-modern"
                      />
                      <small className="text-muted mt-2 d-block">
                        This may take a few moments depending on the number of resumes
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
