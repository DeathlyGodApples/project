import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Briefcase className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Job Description</h3>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};