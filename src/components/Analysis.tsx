import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ResumeAnalysis } from '../types';
import { ResumeComparison } from './ResumeComparison';

interface AnalysisProps {
  analysis: ResumeAnalysis | null;
  error: string | null;
}

export function Analysis({ analysis, error }: AnalysisProps) {
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start space-x-3">
        <XCircle className="flex-shrink-0 h-6 w-6 mt-1" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Analysis Failed</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-center">
        <p>Your analysis results will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Score Cards */}
      <motion.div 
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600 mb-2">Original Score</h3>
          <div className="text-4xl font-bold text-blue-700">{analysis.originalScore}</div>
        </div>
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h3 className="text-sm font-medium text-purple-600 mb-2">Optimized Score</h3>
          <div className="text-4xl font-bold text-purple-700">{analysis.optimizedScore}</div>
        </div>
      </motion.div>

      {/* Section Feedback */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Section Feedback</h2>
        {analysis.sectionFeedback.map((section, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {section.section}
              <span className="ml-2 text-blue-500">
                {section.matches.length > section.misses.length ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-green-600">Strengths</h4>
                {section.matches.map((match, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{match}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-red-600">Improvements</h4>
                {section.misses.map((miss, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{miss}</p>
                  </div>
                ))}
              </div>
            </div>

            {section.suggestions && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-2">Suggestions</h4>
                <p className="text-gray-700 leading-relaxed">{section.suggestions}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Resume Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Resume Comparison</h2>
        <ResumeComparison 
          analysis={analysis} 
          originalText={analysis.originalText} 
        />
      </div>
    </div>
  );
}