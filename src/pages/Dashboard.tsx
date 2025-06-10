
import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state } = useApp();

  const totalAnalyses = state.comparisonHistory.length;
  const totalCandidates = state.comparisonHistory.reduce((acc, item) => acc + item.candidateCount, 0);
  const averageScore = state.comparisonHistory.length > 0 
    ? Math.round(state.comparisonHistory.reduce((acc, item) => acc + item.avgScore, 0) / state.comparisonHistory.length)
    : 0;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Overview of your candidate analysis activities</p>
        </div>
        <Link to="/" className="btn btn-primary">
          New Analysis
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <BarChart3 size={32} className="text-primary mb-2" />
              <h3 className="mb-1">{totalAnalyses}</h3>
              <p className="text-muted mb-0">Total Analyses</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Users size={32} className="text-success mb-2" />
              <h3 className="mb-1">{totalCandidates}</h3>
              <p className="text-muted mb-0">Candidates Reviewed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <TrendingUp size={32} className="text-warning mb-2" />
              <h3 className="mb-1">{averageScore}%</h3>
              <p className="text-muted mb-0">Avg Match Score</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Calendar size={32} className="text-info mb-2" />
              <h3 className="mb-1">{state.comparisonHistory.filter(item => 
                new Date(item.date).toDateString() === new Date().toDateString()
              ).length}</h3>
              <p className="text-muted mb-0">Today's Analyses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Analysis History</h5>
            </div>
            <div className="card-body p-0">
              {state.comparisonHistory.length === 0 ? (
                <div className="text-center py-5">
                  <BarChart3 size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No Analysis History</h5>
                  <p className="text-muted mb-4">Start your first candidate analysis to see results here.</p>
                  <Link to="/" className="btn btn-primary">
                    Start Analysis
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Candidates</th>
                        <th scope="col">Avg Score</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.comparisonHistory.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="text-muted me-2" />
                              {item.date}
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">{item.jobTitle}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Users size={16} className="text-muted me-2" />
                              {item.candidateCount}
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${item.avgScore >= 70 ? 'success' : item.avgScore >= 50 ? 'warning' : 'danger'}`}>
                              {item.avgScore}%
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body text-center">
              <BarChart3 size={48} className="text-primary mb-3" />
              <h5>Start New Analysis</h5>
              <p className="text-muted">Upload resumes and job description to begin candidate matching</p>
              <Link to="/" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-body text-center">
              <Users size={48} className="text-success mb-3" />
              <h5>View Latest Results</h5>
              <p className="text-muted">Review your most recent candidate analysis and rankings</p>
              <Link to="/results" className="btn btn-success">
                View Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
