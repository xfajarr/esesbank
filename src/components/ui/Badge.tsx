import React from 'react';

interface BadgeProps {
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'gray' }) => {
  const colors = {
    blue: 'bg-brand-blue text-white border-brand-dark',
    green: 'bg-brand-green text-brand-dark border-brand-dark',
    yellow: 'bg-brand-yellow text-brand-dark border-brand-dark',
    red: 'bg-brand-red text-white border-brand-dark',
    gray: 'bg-gray-400 text-white border-brand-dark',
    purple: 'bg-brand-purple text-white border-brand-dark',
  };

  return (
    <span className={`px-3 py-1 rounded-xl text-[10px] font-black border-2 uppercase tracking-wider shadow-sm ${colors[color]}`}>
      {label}
    </span>
  );
};