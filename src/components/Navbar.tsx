import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faChartBar, 
  faHistory, 
  faCog, 
  faMoon, 
  faSun,
  faBars 
} from '@fortawesome/free-solid-svg-icons';

const AppNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: faHome },
    { path: '/results', label: 'Results', icon: faChartBar },
    { path: '/history', label: 'History', icon: faHistory },
    { path: '/settings', label: 'Settings', icon: faCog },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className="navbar-modern"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          AI Recruiter
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0"
        >
          <FontAwesomeIcon icon={faBars} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.label}
              </Nav.Link>
            ))}
            
            <div className="nav-link d-flex align-items-center">
              <Button
                variant="link"
                onClick={toggleTheme}
                className="theme-toggle-btn border-0 p-0 ms-3"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className="theme-toggle">
                  <FontAwesomeIcon 
                    icon={theme === 'light' ? faMoon : faSun} 
                    className="theme-icon"
                  />
                </div>
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
