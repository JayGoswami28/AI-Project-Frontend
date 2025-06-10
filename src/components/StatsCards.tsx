
import React from 'react';
import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  candidates: any[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ candidates }) => {
  const totalCandidates = candidates.length;
  const highMatch = candidates.filter(c => c.matchScore >= 80).length;
  const mediumMatch = candidates.filter(c => c.matchScore >= 60 && c.matchScore < 80).length;
  const lowMatch = candidates.filter(c => c.matchScore < 60).length;
  const avgScore = totalCandidates > 0 
    ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / totalCandidates)
    : 0;

  const stats = [
    {
      icon: Users,
      value: totalCandidates,
      label: 'Total Candidates',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: CheckCircle,
      value: highMatch,
      label: 'High Match (80%+)',
      color: 'success',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: Clock,
      value: mediumMatch,
      label: 'Medium Match (60-79%)',
      color: 'warning',
      gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
    },
    {
      icon: TrendingUp,
      value: `${avgScore}%`,
      label: 'Average Score',
      color: 'info',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  return (
    <div className="row mt-4">
      {stats.map((stat, index) => (
        <div key={index} className="col-md-3 mb-3">
          <div className="stats-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  width: '60px', 
                  height: '60px',
                  background: stat.gradient
                }}
              >
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <div className={`stats-number text-${stat.color}`}>
              {stat.value}
            </div>
            <div className="stats-label">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
