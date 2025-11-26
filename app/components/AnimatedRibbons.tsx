import React from 'react';

interface AnimatedRibbonsProps {
  className?: string;
}

export default function AnimatedRibbons({ className = '' }: AnimatedRibbonsProps) {

  return (
    <div className={`absolute left-0 right-0 pointer-events-none ${className}`} style={{ top: 0, bottom: 0 }}>
      {/* Left Ribbon */}
      <div className="absolute left-0 top-0 bottom-0 w-32">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 128 1000"
          className="absolute inset-0"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="leftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#a8a29e" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#a8a29e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M 20 0 Q 60 150 40 300 Q 20 450 50 600 Q 80 750 30 900 Q 10 950 40 1000"
            fill="none"
            stroke="url(#leftGradient)"
            strokeWidth="2"
            strokeDasharray="12,8"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Right Ribbon */}
      <div className="absolute right-0 top-0 bottom-0 w-32">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 128 1000"
          className="absolute inset-0"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#a8a29e" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#a8a29e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M 108 0 Q 68 150 88 300 Q 108 450 78 600 Q 48 750 98 900 Q 118 950 88 1000"
            fill="none"
            stroke="url(#rightGradient)"
            strokeWidth="2"
            strokeDasharray="12,8"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Decorative dots */}
      <div className="absolute left-8 top-1/4 w-2 h-2 bg-stone-400 rounded-full opacity-60" />
      <div className="absolute right-8 top-3/4 w-2 h-2 bg-stone-400 rounded-full opacity-60" />
      <div className="absolute left-16 top-2/3 w-1 h-1 bg-stone-500 rounded-full opacity-70" />
    </div>
  );
}
