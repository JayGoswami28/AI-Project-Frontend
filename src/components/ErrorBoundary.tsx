import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh, faHome } from '@fortawesome/free-solid-svg-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and potentially to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // this.logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Clear error state and reload the page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    // Clear error state and navigate to home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Card className="custom-card text-center">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <FontAwesomeIcon 
                      icon={faExclamationTriangle} 
                      size="4x" 
                      className="text-warning mb-3"
                    />
                    <h2 className="h3 fw-bold mb-3">Oops! Something went wrong</h2>
                    <p className="text-muted mb-4">
                      We're sorry, but an unexpected error occurred. This has been logged and our team will look into it.
                    </p>
                  </div>

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button
                      variant="primary"
                      className="btn-gradient"
                      onClick={this.handleReload}
                    >
                      <FontAwesomeIcon icon={faRefresh} className="me-2" />
                      Reload Page
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="btn-outline-gradient"
                      onClick={this.handleGoHome}
                    >
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Go Home
                    </Button>
                  </div>

                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <Alert variant="danger" className="mt-4 text-start">
                      <h6 className="alert-heading">Development Error Details:</h6>
                      <hr />
                      <strong>Error:</strong> {this.state.error.toString()}
                      {this.state.errorInfo && (
                        <div className="mt-2">
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 mb-0 small">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 