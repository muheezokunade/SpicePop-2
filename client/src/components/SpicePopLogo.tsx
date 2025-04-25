import React from "react";

interface SpicePopLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function SpicePopLogo({ className, width = 100, height = 100 }: SpicePopLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="spiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#C52425" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background Circle */}
      <circle cx="100" cy="100" r="90" fill="white" filter="url(#shadow)" />

      {/* Spice Leaf Icon */}
      <g transform="translate(40, 40) scale(0.6)">
        <path 
          d="M100,25 
            C130,45 170,75 160,100 
            C150,125 130,145 100,150 
            C70,145 50,125 40,100 
            C30,75 70,45 100,25z" 
          fill="url(#spiceGradient)" 
          stroke="#7A231A" 
          strokeWidth="2"
        />
        <path 
          d="M100,25 
            C85,55 80,95 100,150" 
          fill="none" 
          stroke="#7A231A" 
          strokeWidth="3"
        />
        <path 
          d="M70,80 
            C80,75 120,75 130,80" 
          fill="none" 
          stroke="#7A231A" 
          strokeWidth="3"
        />
        <path 
          d="M65,110 
            C80,105 120,105 135,110" 
          fill="none" 
          stroke="#7A231A" 
          strokeWidth="3"
        />
        
        {/* Spice Dots/Seeds */}
        <circle cx="85" cy="60" r="5" fill="#7A231A" />
        <circle cx="115" cy="60" r="5" fill="#7A231A" />
        <circle cx="75" cy="95" r="5" fill="#7A231A" />
        <circle cx="125" cy="95" r="5" fill="#7A231A" />
        <circle cx="85" cy="125" r="5" fill="#7A231A" />
        <circle cx="115" cy="125" r="5" fill="#7A231A" />
      </g>
    </svg>
  );
}