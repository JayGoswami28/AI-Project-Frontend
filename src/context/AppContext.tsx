
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  resumeFile: File;
}

interface AppState {
  resumes: File[];
  jobDescription: string;
  candidates: Candidate[];
  isLoading: boolean;
  comparisonHistory: any[];
}

interface AppContextType {
  state: AppState;
  uploadResumes: (files: File[]) => void;
  setJobDescription: (description: string) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  addToHistory: (item: any) => void;
  clearResults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    resumes: [],
    jobDescription: '',
    candidates: [],
    isLoading: false,
    comparisonHistory: []
  });

  const uploadResumes = (files: File[]) => {
    setState(prev => ({ ...prev, resumes: files }));
  };

  const setJobDescription = (description: string) => {
    setState(prev => ({ ...prev, jobDescription: description }));
  };

  const setCandidates = (candidates: Candidate[]) => {
    setState(prev => ({ ...prev, candidates }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const addToHistory = (item: any) => {
    setState(prev => ({ ...prev, comparisonHistory: [item, ...prev.comparisonHistory] }));
  };

  const clearResults = () => {
    setState(prev => ({ ...prev, candidates: [], resumes: [], jobDescription: '' }));
  };

  return (
    <AppContext.Provider value={{
      state,
      uploadResumes,
      setJobDescription,
      setCandidates,
      setLoading,
      addToHistory,
      clearResults
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
