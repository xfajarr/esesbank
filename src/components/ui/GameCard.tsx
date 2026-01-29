import React from 'react';

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  color?: 'white' | 'blue' | 'purple' | 'green' | 'red';
}

export const GameCard: React.FC<GameCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false,
  color = 'white'
}) => {
  const bgColors = {
    white: 'bg-white dark:bg-brand-dark-surface dark:text-white',
    blue: 'bg-brand-blue text-white',
    purple: 'bg-brand-purple text-white',
    green: 'bg-brand-green text-brand-dark',
    red: 'bg-brand-red text-white'
  };

  const interactive = hoverEffect 
    ? 'hover:-translate-y-2 hover:rotate-1 hover:shadow-none cursor-pointer' 
    : '';
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative 
        border-4 border-brand-dark
        rounded-3xl 
        shadow-brawl-thick dark:shadow-brawl-thick-dark
        p-6 
        ${bgColors[color]} 
        transition-all duration-200
        ${interactive} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};