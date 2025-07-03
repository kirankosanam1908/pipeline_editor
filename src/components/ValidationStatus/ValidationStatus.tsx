import React, { useEffect, useState } from 'react';
import type { ValidationStatusProps } from '../../types';

const ValidationStatus: React.FC<ValidationStatusProps> = ({ isValid, message }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevValid, setPrevValid] = useState(isValid);

  useEffect(() => {
    if (prevValid !== isValid) {
      setIsAnimating(true);
      setPrevValid(isValid);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isValid, prevValid]);

  return (
    <div className={`
      relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl
      transition-all duration-300 ease-out transform
      ${isAnimating ? 'scale-105' : 'scale-100'}
      ${isValid 
        ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200/50 shadow-emerald-100/50' 
        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200/50 shadow-red-100/50'
      }
      shadow-lg hover:shadow-xl group cursor-default
      backdrop-blur-sm
    `}>
      {/* Background Animation */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isValid 
          ? 'bg-gradient-to-r from-emerald-100/20 to-green-100/20' 
          : 'bg-gradient-to-r from-red-100/20 to-rose-100/20'
        }
      `} />
      
      {/* Icon Container */}
      <div className={`
        relative flex items-center justify-center w-8 h-8 rounded-lg
        ${isValid 
          ? 'bg-emerald-100 text-emerald-600' 
          : 'bg-red-100 text-red-600'
        }
        ${isAnimating ? 'animate-bounce-once' : ''}
      `}>
        {isValid ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      {/* Message Container */}
      <div className="relative flex flex-col items-start">
        <span className={`
          text-xs font-medium uppercase tracking-wider opacity-75
          ${isValid ? 'text-emerald-600' : 'text-red-600'}
        `}>
          {isValid ? 'Valid' : 'Invalid'} DAG
        </span>
        <span className="text-sm font-semibold leading-tight">
          {message}
        </span>
      </div>

      {/* Pulse Effect for Errors */}
      {!isValid && (
        <div className="absolute -inset-1 rounded-xl bg-red-400/20 animate-pulse-slow" />
      )}

      {/* Mobile Compact Version */}
      <style>{`
        @media (max-width: 640px) {
          .text-xs {
            display: none;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Alternative minimal version for tight spaces
export const ValidationStatusCompact: React.FC<ValidationStatusProps> = ({ isValid, message }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-300 ease-out transform hover:scale-110
          ${isValid 
            ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-200' 
            : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200'
          }
          shadow-lg hover:shadow-xl
        `}
        aria-label={`DAG validation status: ${message}`}
      >
        {isValid ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        
        {/* Ripple Effect */}
        {!isValid && (
          <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className={`
          absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg
          -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap
          ${isValid ? 'bg-emerald-600' : 'bg-red-600'}
          before:content-[''] before:absolute before:top-full before:left-1/2 
          before:transform before:-translate-x-1/2 before:border-4 
          before:border-transparent ${isValid ? 'before:border-t-emerald-600' : 'before:border-t-red-600'}
          animate-fade-in
        `}>
          {message}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ValidationStatus;