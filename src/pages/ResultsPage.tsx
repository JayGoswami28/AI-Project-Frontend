
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Download, FileSpreadsheet, FileText, ArrowUpDown, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CandidateModal from '../components/CandidateModal';
import StatsCards from '../components/StatsCards';

const ResultsPage: React.FC = () => {
  const { state } = useApp();
  const [sortField, setSortField] = useState<'name' | 'matchScore'>('matchScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterScore, setFilterScore] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field: 'name' | 'matchScore') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'matchScore' ? 'desc' : 'asc');
    }
  };

  const handleExportCsv = async () => {
    try {
      await apiService.exportToCsv(filteredAndSortedCandidates);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handleExportPdf = async () => {
    try {
      await apiService.exportToPdf(filteredAndSortedCandidates);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleViewDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const filteredAndSortedCandidates = state.candidates
    .filter(candidate => 
      candidate.matchScore >= filterScore &&
      (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       candidate.skillsMatched.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
       candidate.skillsMissing.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortField === 'matchScore') {
        return sortDirection === 'desc' ? b.matchScore - a.matchScore : a.matchScore - b.matchScore;
      } else {
        return sortDirection === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  if (state.candidates.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="card border-0 shadow-lg p-5 fade-in-up">
            <FileText size={64} className="text-muted mb-3 mx-auto" />
            <h3 className="text-muted mb-3">No Results Available</h3>
            <p className="text-muted mb-4">Upload resumes and job description to see candidate analysis.</p>
            <Link to="/" className="btn btn-primary btn-lg">
              Start Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in-up">
        <div>
          <h2 className="mb-1 fw-bold text-primary">Candidate Analysis Results</h2>
          <p className="text-muted mb-0">
            {state.candidates.length} candidates analyzed • 
            Average score: {Math.round(state.candidates.reduce((acc, c) => acc + c.matchScore, 0) / state.candidates.length)}%
          </p>
        </div>
        <div className="btn-group">
          <button 
            className="btn btn-outline-success"
            onClick={handleExportCsv}
          >
            <FileSpreadsheet size={16} className="me-1" />
            Export CSV
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={handleExportPdf}
          >
            <Download size={16} className="me-1" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Controls Card */}
      <div className="card mb-4 shadow-sm slide-in-right">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <Filter size={16} className="me-2 text-primary" />
                <label htmlFor="scoreFilter" className="form-label mb-0 me-2 fw-semibold">Min Score:</label>
                <input
                  id="scoreFilter"
                  type="range"
                  className="form-range me-3"
                  min="0"
                  max="100"
                  step="10"
                  value={filterScore}
                  onChange={(e) => setFilterScore(Number(e.target.value))}
                  style={{ width: '120px' }}
                />
                <span className="badge bg-primary">{filterScore}%</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search candidates or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <small className="text-muted">
                Showing <strong>{filteredAndSortedCandidates.length}</strong> of <strong>{state.candidates.length}</strong> candidates
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card shadow-sm mb-4 slide-in-right" style={{ animationDelay: '0.2s' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th 
                    scope="col" 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="d-flex align-items-center">
                      Candidate Name
                      <ArrowUpDown size={14} className="ms-1" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('matchScore')}
                  >
                    <div className="d-flex align-items-center">
                      Match Score
                      <ArrowUpDown size={14} className="ms-1" />
                    </div>
                  </th>
                  <th scope="col">Skills Matched</th>
                  <th scope="col">Skills Missing</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCandidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                          style={{ 
                            width: '45px', 
                            height: '45px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          <span className="text-white fw-bold">
                            {candidate.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div 
                            className="fw-semibold cursor-pointer text-primary"
                            onClick={() => handleViewDetails(candidate)}
                            style={{ textDecoration: 'none' }}
                          >
                            {candidate.name}
                          </div>
                          <small className="text-muted">Rank #{index + 1}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress me-3" style={{ width: '100px', height: '10px' }}>
                          <div 
                            className={`progress-bar bg-${getScoreColor(candidate.matchScore)}`}
                            style={{ width: `${candidate.matchScore}%` }}
                          ></div>
                        </div>
                        <span className={`badge bg-${getScoreColor(candidate.matchScore)} fs-6`}>
                          {candidate.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {candidate.skillsMatched.slice(0, 3).map((skill, skillIndex) => (
                          <span key={skillIndex} className="badge bg-success-subtle text-success border border-success">
                            {skill}
                          </span>
                        ))}
                        {candidate.skillsMatched.length > 3 && (
                          <span className="badge bg-light text-muted">
                            +{candidate.skillsMatched.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {candidate.skillsMissing.slice(0, 2).map((skill, skillIndex) => (
                          <span key={skillIndex} className="badge bg-danger-subtle text-danger border border-danger">
                            {skill}
                          </span>
                        ))}
                        {candidate.skillsMissing.length > 2 && (
                          <span className="badge bg-light text-muted">
                            +{candidate.skillsMissing.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewDetails(candidate)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards candidates={state.candidates} />

      {/* Candidate Modal */}
      <CandidateModal 
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
      />
    </div>
  );
};

export default ResultsPage;
