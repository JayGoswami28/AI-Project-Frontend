
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import HeroSection from '../components/HeroSection';
import { Play, FileText, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, uploadResumes, setJobDescription, setCandidates, setLoading, addToHistory } = useApp();
  const [localJobDescription, setLocalJobDescription] = useState(state.jobDescription);
  const [localResumes, setLocalResumes] = useState<File[]>(state.resumes);
  const [charCount, setCharCount] = useState(localJobDescription.length);

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 5000) {
      setLocalJobDescription(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localResumes.length === 0) {
      alert('Please upload at least one resume.');
      return;
    }
    
    if (localJobDescription.trim().length < 50) {
      alert('Job description must be at least 50 characters long.');
      return;
    }

    try {
      setLoading(true);
      uploadResumes(localResumes);
      setJobDescription(localJobDescription);
      
      const results = await apiService.compareResumes(localJobDescription, localResumes);
      setCandidates(results);
      
      addToHistory({
        id: Date.now(),
        jobTitle: 'Job Analysis',
        candidateCount: results.length,
        date: new Date().toLocaleDateString(),
        avgScore: Math.round(results.reduce((acc, r) => acc + r.matchScore, 0) / results.length)
      });
      
      navigate('/results');
    } catch (error) {
      console.error('Error comparing resumes:', error);
      alert('An error occurred while processing resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.isLoading) {
    return (
      <div className="container mt-4">
        <LoadingSpinner message="Analyzing Candidates..." />
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Main Form */}
            <div className="card shadow-lg fade-in-up">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary mb-2">Start Your AI Analysis</h3>
                  <p className="text-muted">Upload resumes and job description to get intelligent candidate rankings</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* File Upload Section */}
                  <FileUpload 
                    onFilesSelected={setLocalResumes}
                    acceptedFiles={localResumes}
                  />

                  {/* Job Description Section */}
                  <div className="mb-4">
                    <label htmlFor="jobDescription" className="form-label fw-semibold">
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <textarea
                        id="jobDescription"
                        className="form-control"
                        rows={8}
                        placeholder="Paste the complete job description here including required skills, experience, and qualifications..."
                        value={localJobDescription}
                        onChange={handleJobDescriptionChange}
                        required
                        style={{ resize: 'vertical' }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <small className={`text-${charCount > 4500 ? 'danger' : charCount > 4000 ? 'warning' : 'muted'}`}>
                          {charCount}/5000
                        </small>
                      </div>
                    </div>
                    <div className="form-text">
                      Include specific skills, experience requirements, and qualifications for better matching accuracy.
                      <strong> Minimum 50 characters required.</strong>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={localResumes.length === 0 || localJobDescription.trim().length < 50}
                    >
                      <Play size={20} className="me-2" />
                      Analyze Candidates
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Features Section */}
            <div className="row mt-5">
              <div className="col-md-4 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm slide-in-right">
                  <div className="card-body p-4">
                    <div className="mb-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <FileText size={32} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Smart Resume Parsing</h5>
                    <p className="text-muted">AI extracts and analyzes key information from uploaded resumes with high accuracy</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <div className="card-body p-4">
                    <div className="mb-3" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <Zap size={32} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Intelligent Matching</h5>
                    <p className="text-muted">Advanced algorithms compare candidates against job requirements with precision</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <div className="card-body p-4">
                    <div className="mb-3" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <Play size={32} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Instant Results</h5>
                    <p className="text-muted">Get ranked candidates with detailed skill analysis and insights in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
