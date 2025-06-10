
import React from 'react';
import { Zap, Users, BarChart3 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center hero-content">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="hero-title fade-in-up">
              Streamline Your Hiring with AI
            </h1>
            <p className="hero-subtitle fade-in-up">
              Transform your recruitment process with intelligent candidate matching, 
              automated resume analysis, and data-driven insights to find the perfect fit.
            </p>
            
            <div className="row mt-5">
              <div className="col-md-4 mb-3">
                <div className="text-center slide-in-right">
                  <Zap size={48} className="text-white mb-3" style={{ opacity: 0.9 }} />
                  <h5 className="text-white fw-semibold">AI-Powered</h5>
                  <p className="text-white-50">Advanced algorithms analyze resumes instantly</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-center slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <Users size={48} className="text-white mb-3" style={{ opacity: 0.9 }} />
                  <h5 className="text-white fw-semibold">Smart Matching</h5>
                  <p className="text-white-50">Intelligent candidate-job fit scoring</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-center slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <BarChart3 size={48} className="text-white mb-3" style={{ opacity: 0.9 }} />
                  <h5 className="text-white fw-semibold">Data Insights</h5>
                  <p className="text-white-50">Comprehensive analytics and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
