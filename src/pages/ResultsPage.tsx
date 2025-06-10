import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Badge, 
  ProgressBar,
  Modal,
  Alert,
  Pagination,
  Dropdown
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faSortUp, 
  faSortDown, 
  faEye, 
  faDownload, 
  faFileCsv, 
  faFilePdf,
  faUsers,
  faChartLine,
  faTrophy,
  faHome,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContainer';
import { Candidate } from '../context/AppContext';

type SortField = 'name' | 'matchScore' | 'skillsMatched' | 'skillsMissing';
type SortDirection = 'asc' | 'desc';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('matchScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const candidatesPerPage = 10;

  // Mock data if no candidates (for demonstration)
  const mockCandidates: Candidate[] = state.candidates.length === 0 ? [
    {
      id: '1',
      name: 'John Smith',
      matchScore: 92,
      skillsMatched: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      skillsMissing: ['Docker'],
      resumeFile: new File([''], 'john-smith-resume.pdf'),
      resumeContent: 'Senior Software Engineer with 5+ years of experience...',
      insights: 'Excellent candidate with strong technical skills.',
      contactInfo: { email: 'john@example.com', phone: '+1-555-0123' }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      matchScore: 88,
      skillsMatched: ['React', 'JavaScript', 'CSS'],
      skillsMissing: ['TypeScript', 'Node.js'],
      resumeFile: new File([''], 'sarah-johnson-resume.pdf'),
      resumeContent: 'Frontend Developer with 3+ years of experience...',
      insights: 'Strong frontend skills, would benefit from backend training.',
      contactInfo: { email: 'sarah@example.com', location: 'New York, NY' }
    },
    {
      id: '3',
      name: 'Michael Brown',
      matchScore: 75,
      skillsMatched: ['JavaScript', 'CSS'],
      skillsMissing: ['React', 'TypeScript', 'Node.js'],
      resumeFile: new File([''], 'michael-brown-resume.pdf'),
      resumeContent: 'Junior Developer with 1+ year of experience...',
      insights: 'Promising junior candidate with room for growth.',
      contactInfo: { email: 'michael@example.com' }
    }
  ] : state.candidates;

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = mockCandidates.filter(candidate => {
      const searchLower = searchTerm.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.skillsMatched.some(skill => skill.toLowerCase().includes(searchLower)) ||
        candidate.skillsMissing.some(skill => skill.toLowerCase().includes(searchLower))
      );
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'matchScore':
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case 'skillsMatched':
          aValue = a.skillsMatched.length;
          bValue = b.skillsMatched.length;
          break;
        case 'skillsMissing':
          aValue = a.skillsMissing.length;
          bValue = b.skillsMissing.length;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockCandidates, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const currentCandidates = filteredAndSortedCandidates.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    if (mockCandidates.length === 0) return { total: 0, avgScore: 0, topScore: 0 };
    
    const scores = mockCandidates.map(c => c.matchScore);
    return {
      total: mockCandidates.length,
      avgScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      topScore: Math.max(...scores)
    };
  }, [mockCandidates]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  const handleViewCandidate = (candidate: Candidate) => {
    navigate(`/candidate/${candidate.id}`);
  };

  const handleQuickView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (format === 'csv') {
        // Mock CSV export
        const csvContent = [
          ['Name', 'Match Score', 'Skills Matched', 'Skills Missing'],
          ...filteredAndSortedCandidates.map(candidate => [
            candidate.name,
            `${candidate.matchScore}%`,
            candidate.skillsMatched.join('; '),
            candidate.skillsMissing.join('; ')
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'candidate-comparison.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      
      addToast({
        type: 'success',
        message: `Successfully exported ${filteredAndSortedCandidates.length} candidates to ${format.toUpperCase()}`
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Export failed. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (mockCandidates.length === 0 && state.candidates.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <Card className="custom-card">
              <Card.Body className="p-5">
                <FontAwesomeIcon icon={faUsers} size="4x" className="text-muted mb-4" />
                <h3 className="mb-3">No Results Available</h3>
                <p className="text-muted mb-4">
                  Upload resumes and run an analysis to see candidate comparison results here.
                </p>
                <Link to="/" className="btn btn-gradient btn-lg">
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Start New Analysis
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-2">
                <FontAwesomeIcon icon={faUsers} className="me-3" />
                Candidate Results
              </h2>
              <p className="text-muted mb-0">
                Analysis results for {stats.total} candidate{stats.total !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/" className="btn btn-secondary-custom">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                New Analysis
              </Link>
              <Dropdown>
                <Dropdown.Toggle 
                  className="btn-gradient"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Export
                    </>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleExport('csv')}>
                    <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                    Export as CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleExport('pdf')}>
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    Export as PDF
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary mb-3" />
              <h4 className="fw-bold mb-1">{stats.total}</h4>
              <small className="text-muted">Total Candidates</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faChartLine} size="2x" className="text-success mb-3" />
              <h4 className="fw-bold mb-1">{stats.avgScore}%</h4>
              <small className="text-muted">Average Match</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faTrophy} size="2x" className="text-warning mb-3" />
              <h4 className="fw-bold mb-1">{stats.topScore}%</h4>
              <small className="text-muted">Top Score</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-modern"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <div className="text-end">
            <small className="text-muted">
              Showing {currentCandidates.length} of {filteredAndSortedCandidates.length} candidates
            </small>
          </div>
        </Col>
      </Row>

      {/* Results Table */}
      <Card className="custom-card">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table-modern mb-0">
              <thead>
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    style={{ cursor: 'pointer' }}
                  >
                    Candidate Name
                    <FontAwesomeIcon icon={getSortIcon('name')} className="ms-2" />
                  </th>
                  <th 
                    onClick={() => handleSort('matchScore')}
                    style={{ cursor: 'pointer' }}
                  >
                    Match Score
                    <FontAwesomeIcon icon={getSortIcon('matchScore')} className="ms-2" />
                  </th>
                  <th 
                    onClick={() => handleSort('skillsMatched')}
                    style={{ cursor: 'pointer' }}
                  >
                    Skills Matched
                    <FontAwesomeIcon icon={getSortIcon('skillsMatched')} className="ms-2" />
                  </th>
                  <th 
                    onClick={() => handleSort('skillsMissing')}
                    style={{ cursor: 'pointer' }}
                  >
                    Skills Missing
                    <FontAwesomeIcon icon={getSortIcon('skillsMissing')} className="ms-2" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="fw-semibold">{candidate.name}</div>
                      {candidate.contactInfo?.email && (
                        <small className="text-muted">{candidate.contactInfo.email}</small>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={candidate.matchScore} 
                          className="progress-modern me-3"
                          style={{ width: '80px' }}
                        />
                        <span className="fw-bold">{candidate.matchScore}%</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        {candidate.skillsMatched.slice(0, 3).map((skill, index) => (
                          <Badge key={index} className="badge-skill me-1 mb-1">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skillsMatched.length > 3 && (
                          <Badge bg="secondary" className="mb-1">
                            +{candidate.skillsMatched.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {candidate.skillsMissing.slice(0, 2).map((skill, index) => (
                          <Badge key={index} className="badge-missing me-1 mb-1">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skillsMissing.length > 2 && (
                          <Badge bg="secondary" className="mb-1">
                            +{candidate.skillsMissing.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          className="btn-outline-gradient"
                          size="sm"
                          onClick={() => handleViewCandidate(candidate)}
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                          className="btn-secondary-custom"
                          size="sm"
                          onClick={() => handleQuickView(candidate)}
                          title="Quick View"
                        >
                          Quick View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* Quick View Modal */}
      <Modal 
        show={showCandidateModal} 
        onHide={() => setShowCandidateModal(false)} 
        size="lg"
        className="modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCandidate?.name} - Quick View
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCandidate && (
            <Row>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Match Score</h6>
                <div className="d-flex align-items-center mb-4">
                  <ProgressBar 
                    now={selectedCandidate.matchScore} 
                    className="progress-modern me-3"
                    style={{ width: '120px' }}
                  />
                  <span className="fw-bold h5">{selectedCandidate.matchScore}%</span>
                </div>

                <h6 className="fw-bold mb-3">Skills Matched</h6>
                <div className="mb-4">
                  {selectedCandidate.skillsMatched.map((skill, index) => (
                    <Badge key={index} className="badge-skill me-1 mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Contact Information</h6>
                <div className="mb-4">
                  {selectedCandidate.contactInfo?.email && (
                    <div>Email: {selectedCandidate.contactInfo.email}</div>
                  )}
                  {selectedCandidate.contactInfo?.phone && (
                    <div>Phone: {selectedCandidate.contactInfo.phone}</div>
                  )}
                  {selectedCandidate.contactInfo?.location && (
                    <div>Location: {selectedCandidate.contactInfo.location}</div>
                  )}
                </div>

                <h6 className="fw-bold mb-3">Skills Missing</h6>
                <div>
                  {selectedCandidate.skillsMissing.map((skill, index) => (
                    <Badge key={index} className="badge-missing me-1 mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCandidateModal(false)}
          >
            Close
          </Button>
          <Button 
            className="btn-gradient"
            onClick={() => {
              if (selectedCandidate) {
                handleViewCandidate(selectedCandidate);
              }
            }}
          >
            View Full Details
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResultsPage;
