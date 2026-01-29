import React from 'react';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative font-black uppercase tracking-tight rounded-full border-4 border-brand-dark transition-all duration-75 flex items-center justify-center gap-2 overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-b from-brand-yellow to-yellow-500 text-brand-dark hover:brightness-110",
    secondary: "bg-gradient-to-b from-brand-blue to-blue-600 text-white hover:brightness-110",
    danger: "bg-gradient-to-b from-brand-red to-red-600 text-white hover:brightness-110",
    ghost: "bg-transparent border-0 shadow-none text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-dark dark:hover:text-white pb-1"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs shadow-[0_4px_0_0_#1E272E] active:shadow-[0_1px_0_0_#1E272E] active:translate-y-[3px]",
    md: "px-6 py-2.5 text-sm shadow-[0_6px_0_0_#1E272E] active:shadow-[0_2px_0_0_#1E272E] active:translate-y-[4px]",
    lg: "px-8 py-3.5 text-xl shadow-[0_8px_0_0_#1E272E] active:shadow-[0_3px_0_0_#1E272E] active:translate-y-[5px]"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      <span className="relative z-10 brawl-button-outline drop-shadow-md flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Glossy overlay effect common in game buttons */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-white/15 pointer-events-none rounded-t-[20px] group-active:h-[35%] transition-all" />
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
    </button>
  );
};