import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Analysis } from './components/Analysis';
import { ResumeChat } from './components/ResumeChat';
import { analyzeResume } from './services/gemini';
import type { UploadState } from './types';
import { Loader2, FileText, Briefcase, Brain, Building, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from './useResponsive';
import { animations, getAnimationProps } from './animation';

function App() {
  const { isMobile } = useResponsive();
  const [state, setState] = useState<UploadState>({
    resume: null,
    jobTitle: '',
    jobLevel: 'Mid',
    company: '',
    jobDescription: '',
    isAnalyzing: false,
    error: null,
    analysis: null,
  });

  const validateForm = () => {
    const missing = [];
    if (!state.resume) missing.push('Resume PDF');
    if (!state.jobTitle) missing.push('Job Title');
    if (!state.company) missing.push('Company');
    if (!state.jobDescription) missing.push('Job Description');
    
    if (missing.length > 0) {
      setState(prev => ({
        ...prev,
        error: `Missing required fields:\n${missing.join('\n')}`
      }));
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const analysis = await analyzeResume(
        state.resume!,
        state.jobTitle,
        state.jobLevel,
        state.company,
        state.jobDescription
      );
      setState(prev => ({ ...prev, analysis, isAnalyzing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Analysis failed',
        isAnalyzing: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-matte">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.header 
          {...getAnimationProps('slideAndFade', { direction: 'top' })}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary-dark mb-4 flex items-center justify-center">
            <Sparkles className="mr-3 h-8 w-8 text-accent-blue" />
            AI Resume Analyzer
          </h1>
          <p className="text-text-secondary text-lg">
            Transform your resume with professional AI-powered insights
          </p>
        </motion.header>

        <div className={`grid ${!isMobile ? 'lg:grid-cols-2' : ''} gap-12`}>
          <motion.div 
            className="card-neumorph space-y-8"
            variants={animations.fadeIn}
            initial="hidden"
            animate="visible"
          >
            {/* Resume Upload */}
            <motion.div variants={animations.fadeIn}>
              <div className="group">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-primary-dark">
                  <FileText className="mr-2 text-accent-blue" />
                  Upload Resume
                </h2>
                <FileUpload 
                  onFileUpload={(file) => setState(p => ({ ...p, resume: file }))}
                  accept=".pdf"
                  multiple={false}
                />
                {state.resume && (
                  <motion.div 
                    className="mt-4 neumorph-pressed p-4 flex items-center justify-between"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="text-accent-blue" />
                      <span className="text-sm font-medium text-primary-dark">
                        {state.resume.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setState(p => ({ ...p, resume: null }))}
                      className="text-accent-error hover:text-accent-error/80 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Job Details */}
            <motion.div variants={animations.fadeIn} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={state.jobTitle}
                    onChange={(e) => setState(p => ({ ...p, jobTitle: e.target.value }))}
                    className="input-neumorph"
                    placeholder="Job Title"
                  />
                  <Briefcase className="absolute right-3 top-3.5 h-5 w-5 text-accent-blue/60" />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={state.company}
                    onChange={(e) => setState(p => ({ ...p, company: e.target.value }))}
                    className="input-neumorph"
                    placeholder="Company Name"
                  />
                  <Building className="absolute right-3 top-3.5 h-5 w-5 text-accent-blue/60" />
                </div>

                <div className="relative">
                  <select
                    value={state.jobLevel}
                    onChange={(e) => setState(p => ({ ...p, jobLevel: e.target.value as any }))}
                    className="select-neumorph"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none">
                    <svg className="h-5 w-5 text-accent-blue/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div variants={animations.fadeIn}>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary-dark">
                  <Briefcase className="inline-block mr-2 mb-1 h-5 w-5 text-accent-blue" />
                  Job Description
                </h2>
                <textarea
                  value={state.jobDescription}
                  onChange={(e) => setState(p => ({ ...p, jobDescription: e.target.value }))}
                  className="input-neumorph min-h-[160px] resize-y"
                  placeholder="Paste job description here..."
                />
              </div>
            </motion.div>

            {/* Analyze Button */}
            <motion.div variants={animations.fadeIn}>
              <button
                onClick={handleAnalyze}
                disabled={state.isAnalyzing}
                className="btn-neumorph w-full"
              >
                <AnimatePresence mode="wait">
                  {state.isAnalyzing ? (
                    <motion.span 
                      className="flex items-center justify-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="animate-spin h-6 w-6" />
                      <span className="text-lg font-medium">Analyzing...</span>
                    </motion.span>
                  ) : (
                    <motion.span 
                      className="flex items-center justify-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Brain className="h-6 w-6" />
                      <span className="text-lg font-medium">Analyze Resume</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence mode="wait">
              {state.error && (
                <motion.div
                  variants={animations.tooltipAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="neumorph-pressed p-4 flex items-start space-x-3 bg-error-50"
                >
                  <X className="flex-shrink-0 h-5 w-5 text-accent-error mt-0.5" />
                  <div className="text-accent-error whitespace-pre-line">{state.error}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            className={`${
              !isMobile ? 'sticky top-8 h-[calc(100vh-4rem)]' : 'h-auto'
            } card-neumorph overflow-y-auto scrollbar-neumorph`}
            {...getAnimationProps('slideAndFade', { direction: 'right' })}
          >
            <Analysis 
              analysis={state.analysis}
              error={state.error}
            />
          </motion.div>
        </div>

        {/* Add ResumeChat component */}
        {state.analysis && (
          <ResumeChat analysis={state.analysis} />
        )}
      </div>
    </div>
  );
}

export default App;