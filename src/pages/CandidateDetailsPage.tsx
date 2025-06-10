import React from 'react';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faFileAlt, 
  faLightbulb, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faGraduationCap,
  faBriefcase,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById } = useApp();

  const candidate = id ? getCandidateById(id) : null;

  if (!candidate) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <Card className="custom-card">
              <Card.Body className="p-5">
                <h3>Candidate Not Found</h3>
                <p className="text-muted mb-4">
                  The candidate you're looking for doesn't exist or has been removed.
                </p>
                <Button 
                  className="btn-gradient"
                  onClick={() => navigate('/results')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Results
                </Button>
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
          <div className="d-flex align-items-center justify-content-between">
            <Button
              variant="outline-primary"
              className="btn-outline-gradient"
              onClick={() => navigate('/results')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Results
            </Button>
            
            <div className="text-end">
              <h5 className="mb-0">Match Score</h5>
              <div className="d-flex align-items-center">
                <ProgressBar 
                  now={candidate.matchScore} 
                  className="progress-modern me-3"
                  style={{ width: '100px' }}
                />
                <span className="fw-bold h4 mb-0 text-primary">
                  {candidate.matchScore}%
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          {/* Candidate Overview Card */}
          <Card className="custom-card">
            <Card.Header className="bg-gradient text-white text-center">
              <FontAwesomeIcon icon={faUser} size="3x" className="mb-3" />
              <h4 className="mb-0">{candidate.name}</h4>
            </Card.Header>
            <Card.Body>
              {/* Contact Information */}
              {candidate.contactInfo && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Contact Information
                  </h6>
                  
                  {candidate.contactInfo.email && (
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-muted me-2" />
                      <small>{candidate.contactInfo.email}</small>
                    </div>
                  )}
                  
                  {candidate.contactInfo.phone && (
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faPhone} className="text-muted me-2" />
                      <small>{candidate.contactInfo.phone}</small>
                    </div>
                  )}
                  
                  {candidate.contactInfo.location && (
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-muted me-2" />
                      <small>{candidate.contactInfo.location}</small>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Matched */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                  Skills Matched ({candidate.skillsMatched.length})
                </h6>
                <div>
                  {candidate.skillsMatched.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="badge-skill me-1 mb-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills Missing */}
              {candidate.skillsMissing.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-warning me-2" />
                    Skills Missing ({candidate.skillsMissing.length})
                  </h6>
                  <div>
                    {candidate.skillsMissing.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="badge-missing me-1 mb-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Detailed Information Tabs */}
          <Card className="custom-card">
            <Card.Body className="p-0">
              <Tabs
                defaultActiveKey="overview"
                className="nav-tabs-modern"
                fill
              >
                <Tab 
                  eventKey="overview" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Overview
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={6} className="mb-4">
                        <h6 className="fw-bold mb-3">
                          <FontAwesomeIcon icon={faBriefcase} className="text-primary me-2" />
                          Experience
                        </h6>
                        <p className="text-muted">
                          {candidate.experience || 'Experience information not available'}
                        </p>
                      </Col>
                      <Col md={6} className="mb-4">
                        <h6 className="fw-bold mb-3">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-primary me-2" />
                          Education
                        </h6>
                        <p className="text-muted">
                          {candidate.education || 'Education information not available'}
                        </p>
                      </Col>
                    </Row>
                    
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Match Analysis</h6>
                      <div className="row">
                        <div className="col-md-4 text-center mb-3">
                          <div className="bg-light rounded p-3">
                            <h4 className="text-success mb-1">{candidate.matchScore}%</h4>
                            <small className="text-muted">Overall Match</small>
                          </div>
                        </div>
                        <div className="col-md-4 text-center mb-3">
                          <div className="bg-light rounded p-3">
                            <h4 className="text-primary mb-1">{candidate.skillsMatched.length}</h4>
                            <small className="text-muted">Skills Matched</small>
                          </div>
                        </div>
                        <div className="col-md-4 text-center mb-3">
                          <div className="bg-light rounded p-3">
                            <h4 className="text-warning mb-1">{candidate.skillsMissing.length}</h4>
                            <small className="text-muted">Skills Gap</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab 
                  eventKey="resume" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                      Resume
                    </span>
                  }
                >
                  <div className="p-4">
                    <h6 className="fw-bold mb-3">Resume Content</h6>
                    <div className="bg-light rounded p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {candidate.resumeContent || 'Resume content not available for preview'}
                      </pre>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        Original file: {candidate.resumeFile.name}
                      </small>
                    </div>
                  </div>
                </Tab>

                <Tab 
                  eventKey="insights" 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                      AI Insights
                    </span>
                  }
                >
                  <div className="p-4">
                    <h6 className="fw-bold mb-3">AI Analysis & Recommendations</h6>
                    <div className="bg-light rounded p-4">
                      <p>
                        {candidate.insights || 
                          `Based on the analysis, ${candidate.name} shows strong alignment with the job requirements. ` +
                          `The candidate demonstrates ${candidate.skillsMatched.length} matching skills and has a ${candidate.matchScore}% overall compatibility score. ` +
                          `Areas for development include ${candidate.skillsMissing.join(', ')}.`
                        }
                      </p>
                    </div>

                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Recommendation</h6>
                      <div className={`alert ${candidate.matchScore >= 80 ? 'alert-success' : candidate.matchScore >= 60 ? 'alert-warning' : 'alert-info'}`}>
                        {candidate.matchScore >= 80 && (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            <strong>Highly Recommended:</strong> This candidate is an excellent match for the position.
                          </>
                        )}
                        {candidate.matchScore >= 60 && candidate.matchScore < 80 && (
                          <>
                            <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                            <strong>Good Match:</strong> This candidate meets most requirements with some skill gaps.
                          </>
                        )}
                        {candidate.matchScore < 60 && (
                          <>
                            <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                            <strong>Consider with Caution:</strong> This candidate may need additional training or evaluation.
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CandidateDetailsPage;