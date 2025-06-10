
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart3, Home, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <Zap className="text-white" size={20} />
          </div>
          HireMatch AI
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/') ? 'active text-primary' : 'text-dark'}`} 
                to="/"
              >
                <Home size={18} className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/results') ? 'active text-primary' : 'text-dark'}`} 
                to="/results"
              >
                <BarChart3 size={18} className="me-1" />
                Results
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/dashboard') ? 'active text-primary' : 'text-dark'}`} 
                to="/dashboard"
              >
                <Users size={18} className="me-1" />
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
