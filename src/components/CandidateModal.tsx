
import React from 'react';
import { X } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  resumeFile: File;
}

interface CandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} 
         style={{ display: isOpen ? 'block' : 'none' }}
         tabIndex={-1}
         role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <span className="text-white fw-bold fs-4">
                    {candidate.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="fw-bold">{candidate.name}</div>
                  <small className="opacity-75">Candidate Details</small>
                </div>
              </div>
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Match Score Section */}
              <div className="col-md-4 mb-4">
                <div className="text-center p-3 rounded" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                  <h3 className={`text-${getScoreColor(candidate.matchScore)} mb-2`}>
                    {candidate.matchScore}%
                  </h3>
                  <p className="text-muted mb-0">Match Score</p>
                  <div className="progress mt-2" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar bg-${getScoreColor(candidate.matchScore)}`}
                      style={{ width: `${candidate.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* File Info */}
              <div className="col-md-8 mb-4">
                <h6 className="fw-bold text-primary mb-3">Resume Information</h6>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="text-muted">File Name:</small>
                    <p className="mb-2">{candidate.resumeFile.name}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">File Size:</small>
                    <p className="mb-2">{(candidate.resumeFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills Matched */}
            <div className="mb-4">
              <h6 className="fw-bold text-success mb-3">
                Skills Matched ({candidate.skillsMatched.length})
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {candidate.skillsMatched.map((skill, index) => (
                  <span key={index} className="badge bg-success-subtle text-success border border-success">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Skills Missing */}
            <div className="mb-4">
              <h6 className="fw-bold text-danger mb-3">
                Skills Missing ({candidate.skillsMissing.length})
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {candidate.skillsMissing.map((skill, index) => (
                  <span key={index} className="badge bg-danger-subtle text-danger border border-danger">
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* AI Insights Placeholder */}
            <div className="mb-4">
              <h6 className="fw-bold text-primary mb-3">AI Insights</h6>
              <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <p className="mb-2">
                  <strong>Strengths:</strong> This candidate shows strong technical skills in {candidate.skillsMatched.slice(0, 2).join(' and ')}.
                </p>
                <p className="mb-2">
                  <strong>Growth Areas:</strong> Consider training in {candidate.skillsMissing.slice(0, 2).join(' and ')} to better align with role requirements.
                </p>
                <p className="mb-0">
                  <strong>Recommendation:</strong> {candidate.matchScore >= 80 ? 'Highly recommended for interview' : candidate.matchScore >= 60 ? 'Good candidate with some skill gaps' : 'May require significant training'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={onClose}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
