import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const NotFoundPage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center min-vh-75">
        <Col lg={8} className="text-center">
          <Card className="custom-card border-0">
            <Card.Body className="p-5">
              <div className="mb-4">
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  size="6x" 
                  className="text-warning mb-4"
                />
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="h3 fw-bold mb-3">Page Not Found</h2>
                <p className="text-muted mb-4 lead">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  as={Link} 
                  to="/" 
                  className="btn-gradient"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Go Home
                </Button>
                
                <Button 
                  as={Link} 
                  to="/results" 
                  variant="outline-primary"
                  className="btn-outline-gradient"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  View Results
                </Button>
              </div>

              <div className="mt-4">
                <small className="text-muted">
                  Need help? Contact our support team or check our documentation.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;