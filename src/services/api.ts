const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ComparisonRequest {
  jobDescription: string;
  resumes: File[];
}

export interface ComparisonResult {
  id: string;
  name: string;
  matchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  resumeFile: File;
}

class ApiService {
  async uploadResumes(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`resume_${index}`, file);
    });

    const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload resumes');
    }

    return response.json();
  }

  async compareResumes(jobDescription: string, resumes: File[]): Promise<ComparisonResult[]> {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults: ComparisonResult[] = resumes.map((file, index) => ({
      id: `candidate_${index + 1}`,
      name: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
      matchScore: Math.floor(Math.random() * 40) + 60,
      skillsMatched: ['JavaScript', 'React', 'Node.js', 'Python'].slice(0, Math.floor(Math.random() * 4) + 1),
      skillsMissing: ['Docker', 'AWS', 'MongoDB'].slice(0, Math.floor(Math.random() * 3) + 1),
      resumeFile: file
    }));

    return mockResults.sort((a, b) => b.matchScore - a.matchScore);
  }

  async exportToCsv(candidates: ComparisonResult[]): Promise<void> {
    const csvContent = [
      ['Name', 'Match Score', 'Skills Matched', 'Skills Missing'],
      ...candidates.map(candidate => [
        candidate.name,
        `${candidate.matchScore}%`,
        candidate.skillsMatched.join(', '),
        candidate.skillsMissing.join(', ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'candidate_comparison.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async exportToPdf(candidates: ComparisonResult[]): Promise<void> {
    // Simulate PDF export
    console.log('Exporting to PDF...', candidates);
    alert('PDF export feature would be implemented with a PDF library like jsPDF');
  }
}

export const apiService = new ApiService();
