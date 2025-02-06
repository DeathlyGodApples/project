export interface ResumeAnalysis {
  originalScore: number;
  optimizedScore: number;
  sectionFeedback: SectionFeedback[];
  missingSkills: string[];
  careerPaths: CareerPath[];
  optimizedResume: string;
  highlights: Highlight[];
  originalText: string;
  _groundingMetadata?: {
    queries?: string[];
    sources?: (string | undefined)[];
  };
}

export interface SectionFeedback {
  section: string;
  matches: string[];
  misses: string[];
  suggestions: string;
  sources: string[];
}

export interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  potentialEmployers: string[];
}

export interface Highlight {
  type: 'removed' | 'modified' | 'retained';
  content: string;
  reason: string;
  requirement: string;
  impact: string;
  recommendations?: string;
}

export interface UploadState {
  resume: File | null;
  jobTitle: string;
  jobLevel: string;
  company: string;
  jobDescription: string;
  isAnalyzing: boolean;
  error: string | null;
  analysis: ResumeAnalysis | null;
}