import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'green' | 'blue' | 'purple';
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'green', height = 'h-4' }) => {
  const barColors = {
    green: 'bg-brand-green',
    blue: 'bg-brand-blue',
    purple: 'bg-brand-purple'
  };

  return (
    <div className={`w-full bg-brand-dark/20 rounded-xl border-3 border-brand-dark overflow-hidden ${height} relative shadow-inner`}>
      <div 
        className={`${barColors[color]} h-full transition-all duration-500 ease-out border-r-3 border-brand-dark relative`} 
        style={{ width: `${progress}%` }}
      >
        {/* Glossy shine on the progress bar */}
        <div className="absolute inset-0 bg-white/20 h-1/2 rounded-t-lg"></div>
      </div>
    </div>
  );
};