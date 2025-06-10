import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  Badge
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faSave, 
  faPalette, 
  faDownload, 
  faShieldAlt,
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ToastContainer';

const SettingsPage: React.FC = () => {
  const { state, updateSettings } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [localSettings, setLocalSettings] = useState(state.settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(state.settings);
  }, [state.settings]);

  useEffect(() => {
    const hasChanged = JSON.stringify(localSettings) !== JSON.stringify(state.settings);
    setHasChanges(hasChanged);
  }, [localSettings, state.settings]);

  const handleSettingChange = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    addToast({
      type: 'success',
      message: 'Settings saved successfully!'
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(state.settings);
    setHasChanges(false);
    addToast({
      type: 'info',
      message: 'Settings reset to last saved values'
    });
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-2">
            <FontAwesomeIcon icon={faCog} className="me-3" />
            Settings
          </h2>
          <p className="text-muted mb-0">
            Configure your application preferences and defaults
          </p>
        </Col>
      </Row>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert variant="warning" className="mb-4">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          You have unsaved changes. Don't forget to save your settings.
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          {/* Appearance Settings */}
          <Card className="custom-card mb-4">
            <Card.Header className="bg-gradient text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faPalette} className="me-2" />
                Appearance
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="form-label-modern">
                  Theme Preference
                </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="theme-switch"
                    label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    className="me-3"
                  />
                  <Badge bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </Badge>
                </div>
                <Form.Text className="text-muted">
                  Choose between light and dark theme. Your preference will be remembered.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Export Settings */}
          <Card className="custom-card mb-4">
            <Card.Header className="bg-gradient text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Preferences
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="form-label-modern">
                  Default Export Format
                </Form.Label>
                <Form.Select
                  value={localSettings.defaultExportFormat}
                  onChange={(e) => handleSettingChange('defaultExportFormat', e.target.value as 'csv' | 'pdf')}
                  className="form-control-modern"
                >
                  <option value="csv">CSV (Comma Separated Values)</option>
                  <option value="pdf">PDF (Portable Document Format)</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Your preferred format when exporting candidate comparison results.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="auto-save-switch"
                    label="Auto-save comparisons"
                    checked={localSettings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="me-3"
                  />
                  <Badge bg={localSettings.autoSave ? 'success' : 'secondary'}>
                    {localSettings.autoSave ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <Form.Text className="text-muted">
                  Automatically save comparison results to your history.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* File Upload Settings */}
          <Card className="custom-card mb-4">
            <Card.Header className="bg-gradient text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                File Upload Limits
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="form-label-modern">
                  Maximum File Size: {formatFileSize(localSettings.maxFileSize)}
                </Form.Label>
                <Form.Range
                  min={1048576} // 1MB
                  max={10485760} // 10MB
                  step={1048576} // 1MB steps
                  value={localSettings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  className="mb-2"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">1MB</small>
                  <small className="text-muted">10MB</small>
                </div>
                <Form.Text className="text-muted">
                  Maximum allowed file size for resume uploads.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-modern">
                  Allowed File Types
                </Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {localSettings.allowedFileTypes.map((type, index) => (
                    <Badge key={index} bg="primary" className="badge-skill">
                      {type}
                    </Badge>
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Currently supported file formats for resume uploads.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Save Actions */}
          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Reset Changes
            </Button>
            <Button
              className="btn-gradient"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Settings
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          {/* Settings Info */}
          <Card className="custom-card">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Settings Information
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="fw-bold">Current Configuration</h6>
                <ul className="list-unstyled small">
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Theme: {theme === 'dark' ? 'Dark' : 'Light'}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Export: {state.settings.defaultExportFormat.toUpperCase()}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Auto-save: {state.settings.autoSave ? 'On' : 'Off'}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                    Max file size: {formatFileSize(state.settings.maxFileSize)}
                  </li>
                </ul>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold">Tips</h6>
                <ul className="list-unstyled small text-muted">
                  <li>• Dark mode reduces eye strain in low-light environments</li>
                  <li>• PDF exports include formatting and charts</li>
                  <li>• CSV exports are better for data analysis</li>
                  <li>• Auto-save helps maintain comparison history</li>
                </ul>
              </div>

              <Alert variant="info" className="small">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Settings are automatically saved to your browser's local storage.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage; 