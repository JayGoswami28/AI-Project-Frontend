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
  Modal,
  Alert,
  Pagination
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory, 
  faSearch, 
  faEye, 
  faTrash, 
  faCalendar,
  faUsers,
  faChartLine,
  faExclamationTriangle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContainer';
import { ComparisonHistory } from '../context/AppContext';

const HistoryPage: React.FC = () => {
  const { state, removeFromHistory } = useApp();
  const { addToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonHistory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search comparisons
  const filteredComparisons = useMemo(() => {
    return state.comparisonHistory.filter(comparison => {
      const matchesSearch = comparison.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comparison.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
                         comparison.createdAt.toDateString() === new Date(dateFilter).toDateString();
      
      return matchesSearch && matchesDate;
    });
  }, [state.comparisonHistory, searchTerm, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredComparisons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComparisons = filteredComparisons.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const totalComparisons = state.comparisonHistory.length;
    const totalResumes = state.comparisonHistory.reduce((sum, comp) => sum + comp.resumeCount, 0);
    const avgMatchScore = state.comparisonHistory.length > 0 
      ? Math.round(state.comparisonHistory.reduce((sum, comp) => sum + comp.averageMatchScore, 0) / state.comparisonHistory.length)
      : 0;
    
    return { totalComparisons, totalResumes, avgMatchScore };
  }, [state.comparisonHistory]);

  const handleDeleteClick = (comparison: ComparisonHistory) => {
    setSelectedComparison(comparison);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedComparison) {
      removeFromHistory(selectedComparison.id);
      addToast({
        type: 'success',
        message: 'Comparison deleted successfully'
      });
    }
    setShowDeleteModal(false);
    setSelectedComparison(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (state.comparisonHistory.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <Card className="custom-card">
              <Card.Body className="p-5">
                <FontAwesomeIcon icon={faHistory} size="4x" className="text-muted mb-4" />
                <h3 className="mb-3">No Comparison History</h3>
                <p className="text-muted mb-4">
                  You haven't run any candidate comparisons yet. Start by uploading resumes and analyzing them.
                </p>
                <Link to="/" className="btn btn-gradient btn-lg">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
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
                <FontAwesomeIcon icon={faHistory} className="me-3" />
                Comparison History
              </h2>
              <p className="text-muted mb-0">
                View and manage your past candidate analyses
              </p>
            </div>
            <Link to="/" className="btn btn-gradient">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Analysis
            </Link>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="custom-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faChartLine} size="2x" className="text-primary mb-3" />
              <h4 className="fw-bold mb-1">{stats.totalComparisons}</h4>
              <small className="text-muted">Total Comparisons</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="custom-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faUsers} size="2x" className="text-success mb-3" />
              <h4 className="fw-bold mb-1">{stats.totalResumes}</h4>
              <small className="text-muted">Resumes Analyzed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="custom-card">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faChartLine} size="2x" className="text-info mb-3" />
              <h4 className="fw-bold mb-1">{stats.avgMatchScore}%</h4>
              <small className="text-muted">Average Match Score</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by job title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-modern"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faCalendar} />
            </InputGroup.Text>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control-modern"
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Results Info */}
      {searchTerm || dateFilter ? (
        <Alert variant="info" className="mb-4">
          Showing {filteredComparisons.length} of {state.comparisonHistory.length} comparisons
          {searchTerm && ` matching "${searchTerm}"`}
          {dateFilter && ` from ${new Date(dateFilter).toDateString()}`}
        </Alert>
      ) : null}

      {/* History Table */}
      <Card className="custom-card">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table-modern mb-0">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Description</th>
                  <th>Resumes</th>
                  <th>Avg Score</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentComparisons.map((comparison) => (
                  <tr key={comparison.id}>
                    <td>
                      <div className="fw-semibold">
                        {comparison.jobTitle || 'Untitled Position'}
                      </div>
                    </td>
                    <td>
                      <div className="text-muted small">
                        {truncateText(comparison.jobDescription, 100)}
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary" className="badge-skill">
                        {comparison.resumeCount} resumes
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="progress progress-modern me-2" 
                          style={{ width: '60px', height: '6px' }}
                        >
                          <div 
                            className="progress-bar progress-bar-gradient" 
                            style={{ width: `${comparison.averageMatchScore}%` }}
                          />
                        </div>
                        <span className="fw-semibold">
                          {comparison.averageMatchScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(comparison.createdAt)}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="View Results"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(comparison)}
                          title="Delete Comparison"
                        >
                          <FontAwesomeIcon icon={faTrash} />
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="modal-modern">
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this comparison? This action cannot be undone.
          </p>
          {selectedComparison && (
            <div className="bg-light rounded p-3">
              <strong>Job Title:</strong> {selectedComparison.jobTitle || 'Untitled Position'}<br />
              <strong>Date:</strong> {formatDate(selectedComparison.createdAt)}<br />
              <strong>Resumes:</strong> {selectedComparison.resumeCount}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HistoryPage; 