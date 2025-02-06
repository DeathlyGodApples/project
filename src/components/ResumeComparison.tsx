import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ResumeAnalysis } from '../types';
import DOMPurify from 'dompurify';
import { useResponsive } from '../useResponsive';
import { animations, getAnimationProps } from '../animation';

const createTooltipCard = (data: {
  type: string;
  original?: string;
  change?: string;
  reason: string;
  impact: string;
}) => {
  return `
    <div class="tooltip-card">
      <div class="tooltip-header ${data.type.toLowerCase()}">
        <span class="tooltip-type">${data.type}</span>
      </div>
      <div class="tooltip-content">
        ${data.original ? `
          <div class="tooltip-section">
            <div class="tooltip-label">Original</div>
            <div class="tooltip-text">${data.original}</div>
          </div>
        ` : ''}
        ${data.change ? `
          <div class="tooltip-section">
            <div class="tooltip-label">Change</div>
            <div class="tooltip-text">${data.change}</div>
          </div>
        ` : ''}
        <div class="tooltip-section">
          <div class="tooltip-label">Reason</div>
          <div class="tooltip-text">${data.reason}</div>
        </div>
        <div class="tooltip-section">
          <div class="tooltip-label">Impact</div>
          <div class="tooltip-text">${data.impact}</div>
        </div>
      </div>
    </div>
  `;
};

export const ResumeComparison: React.FC<{ 
  analysis: ResumeAnalysis; 
  originalText: string 
}> = ({ analysis, originalText }) => {
  const [activeTab, setActiveTab] = useState<'original' | 'optimized'>('original');
  const { isMobile } = useResponsive();

  useEffect(() => {
    const applyHighlights = () => {
      let highlightedText = analysis.optimizedResume;
      
      const sortedHighlights = [...analysis.highlights].sort(
        (a, b) => b.content.length - a.content.length
      );

      sortedHighlights.forEach(hl => {
        const plainContent = hl.content.trim();
        if (!plainContent) return;

        const highlightHTML = `
          <span 
            class="highlight-${hl.type}" 
            data-tooltip='${createTooltipCard({
              type: hl.type.charAt(0).toUpperCase() + hl.type.slice(1),
              original: hl.type === 'modified' ? plainContent : undefined,
              change: hl.type === 'modified' ? hl.content : undefined,
              reason: hl.reason,
              impact: hl.impact
            })}'
          >${plainContent}</span>
        `;

        const regex = new RegExp(`(^|\\s)(${plainContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=\\s|$)`, 'gi');
        highlightedText = highlightedText.replace(regex, `$1${highlightHTML}`);
      });

      const optimizedContainer = document.querySelector('.optimized-resume');
      if (optimizedContainer) {
        optimizedContainer.innerHTML = DOMPurify.sanitize(highlightedText);

        document.querySelectorAll('[data-tooltip]').forEach(element => {
          element.addEventListener('mouseenter', (e) => {
            const target = e.target as HTMLElement;
            const tooltipContent = target.getAttribute('data-tooltip');
            if (!tooltipContent) return;

            const existingTooltip = document.querySelector('.tooltip-card');
            if (existingTooltip) existingTooltip.remove();

            const tooltipContainer = document.createElement('div');
            tooltipContainer.innerHTML = tooltipContent;
            document.body.appendChild(tooltipContainer.firstChild as Node);

            const tooltip = document.querySelector('.tooltip-card') as HTMLElement;
            if (!tooltip) return;

            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            tooltip.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - tooltip.offsetWidth - 10))}px`;
            tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight - 10}px`;
          });
        });

        document.addEventListener('mouseleave', (e) => {
          if (!(e.target as HTMLElement).closest('[data-tooltip]')) {
            const tooltip = document.querySelector('.tooltip-card');
            if (tooltip) tooltip.remove();
          }
        });
      }
    };

    const timer = setTimeout(applyHighlights, 500);
    return () => clearTimeout(timer);
  }, [analysis.highlights, analysis.optimizedResume]);

  return (
    <motion.div {...getAnimationProps('fadeIn')} className="container py-8">
      <AnimatePresence mode="wait">
        {isMobile && (
          <motion.div 
            {...getAnimationProps('slideAndFade')}
            className="md:hidden mb-4"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('original')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  activeTab === 'original' 
                    ? 'bg-primary-dark text-white' 
                    : 'bg-bg-card text-text-primary'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setActiveTab('optimized')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  activeTab === 'optimized' 
                    ? 'bg-primary-dark text-white' 
                    : 'bg-bg-card text-text-primary'
                }`}
              >
                Optimized
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={animations.cardHover}
          whileHover="hover"
          className={`resume-card ${activeTab !== 'original' ? 'hidden md:block' : ''}`}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Original Resume</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{originalText}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={animations.cardHover}
          whileHover="hover"
          className={`resume-card ${activeTab !== 'optimized' ? 'hidden md:block' : ''}`}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Optimized Resume</h2>
            <div className="optimized-resume prose max-w-none">
              {/* Content will be injected by useEffect */}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={animations.fadeIn}
        className="mt-6 resume-card p-4"
      >
        <h3 className="text-sm font-semibold mb-2">Highlight Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-accent-yellow mr-2 rounded"></span>
            <span className="text-sm">Modified/New Content</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-accent-green mr-2 rounded"></span>
            <span className="text-sm">Retained Content</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-accent-red mr-2 rounded"></span>
            <span className="text-sm">Removed Content</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};