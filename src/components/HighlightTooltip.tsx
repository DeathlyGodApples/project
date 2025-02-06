import { useState, useRef, useEffect } from 'react';

export const HighlightTooltip = ({ 
  reason, 
  requirement, 
  impact, 
  recommendations 
}: {
  reason: string;
  requirement: string;
  impact: string;
  recommendations?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);
    const current = ref.current;

    current?.addEventListener('mouseenter', show);
    current?.addEventListener('mouseleave', hide);

    return () => {
      current?.removeEventListener('mouseenter', show);
      current?.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
          <div className="text-sm space-y-2">
            <div>
              <h4 className="font-semibold text-gray-900">Reason:</h4>
              <p className="text-gray-700">{reason}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Requirement:</h4>
              <p className="text-gray-700">{requirement}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Impact:</h4>
              <p className="text-gray-700">{impact}</p>
            </div>
            {recommendations && (
              <div>
                <h4 className="font-semibold text-gray-900">Recommendations:</h4>
                <p className="text-gray-700">{recommendations}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};