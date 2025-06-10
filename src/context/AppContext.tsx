import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Resume {
  id: string;
  file: File;
  content?: string;
  uploadedAt: Date;
}

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  resumeFile: File;
  resumeContent?: string;
  insights?: string;
  experience?: string;
  education?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

interface ComparisonHistory {
  id: string;
  jobTitle: string;
  jobDescription: string;
  resumeCount: number;
  averageMatchScore: number;
  createdAt: Date;
  candidates: Candidate[];
}

interface AppState {
  resumes: Resume[];
  jobDescription: string;
  jobTitle: string;
  candidates: Candidate[];
  isLoading: boolean;
  comparisonHistory: ComparisonHistory[];
  currentComparison: ComparisonHistory | null;
  error: string | null;
  settings: {
    defaultExportFormat: 'csv' | 'pdf';
    autoSave: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

interface AppContextType {
  state: AppState;
  uploadResumes: (files: File[]) => Promise<void>;
  setJobDescription: (description: string) => void;
  setJobTitle: (title: string) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (comparison: ComparisonHistory) => void;
  removeFromHistory: (id: string) => void;
  clearResults: () => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  getCandidateById: (id: string) => Candidate | undefined;
  getComparisonById: (id: string) => ComparisonHistory | undefined;
}

const defaultSettings: AppState['settings'] = {
  defaultExportFormat: 'csv',
  autoSave: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['.pdf', '.doc', '.docx'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage if available
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          ...parsed,
          resumes: [],
          candidates: [],
          isLoading: false,
          error: null,
          currentComparison: null,
          settings: { ...defaultSettings, ...parsed.settings },
        };
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
    
    return {
      resumes: [],
      jobDescription: '',
      jobTitle: '',
      candidates: [],
      isLoading: false,
      comparisonHistory: [],
      currentComparison: null,
      error: null,
      settings: defaultSettings,
    };
  });

  // Save state to localStorage when it changes (excluding resumes and candidates)
  React.useEffect(() => {
    const stateToSave = {
      jobDescription: state.jobDescription,
      jobTitle: state.jobTitle,
      comparisonHistory: state.comparisonHistory,
      settings: state.settings,
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
  }, [state.jobDescription, state.jobTitle, state.comparisonHistory, state.settings]);

  const uploadResumes = async (files: File[]): Promise<void> => {
    const resumes: Resume[] = files.map(file => ({
      id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      uploadedAt: new Date(),
    }));
    
    setState(prev => ({ ...prev, resumes, error: null }));
  };

  const setJobDescription = (description: string) => {
    setState(prev => ({ ...prev, jobDescription: description }));
  };

  const setJobTitle = (title: string) => {
    setState(prev => ({ ...prev, jobTitle: title }));
  };

  const setCandidates = (candidates: Candidate[]) => {
    setState(prev => ({ ...prev, candidates }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const addToHistory = (comparison: ComparisonHistory) => {
    setState(prev => ({ 
      ...prev, 
      comparisonHistory: [comparison, ...prev.comparisonHistory],
      currentComparison: comparison
    }));
  };

  const removeFromHistory = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      comparisonHistory: prev.comparisonHistory.filter(item => item.id !== id)
    }));
  };

  const clearResults = () => {
    setState(prev => ({ 
      ...prev, 
      candidates: [], 
      resumes: [], 
      jobDescription: '',
      jobTitle: '',
      currentComparison: null,
      error: null
    }));
  };

  const updateSettings = (newSettings: Partial<AppState['settings']>) => {
    setState(prev => ({ 
      ...prev, 
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const getCandidateById = (id: string): Candidate | undefined => {
    return state.candidates.find(candidate => candidate.id === id);
  };

  const getComparisonById = (id: string): ComparisonHistory | undefined => {
    return state.comparisonHistory.find(comparison => comparison.id === id);
  };

  return (
    <AppContext.Provider value={{
      state,
      uploadResumes,
      setJobDescription,
      setJobTitle,
      setCandidates,
      setLoading,
      setError,
      addToHistory,
      removeFromHistory,
      clearResults,
      updateSettings,
      getCandidateById,
      getComparisonById,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { Candidate, Resume, ComparisonHistory, AppState };
