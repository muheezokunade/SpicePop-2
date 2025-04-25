import React from "react";

interface NewSpicePopLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'light' | 'dark';
}

export function NewSpicePopLogo({ 
  className, 
  width = 100, 
  height = 100, 
  variant = 'light' 
}: NewSpicePopLogoProps) {
  // Create SVG version of the logo that looks like the image
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background */}
      <rect width="500" height="500" fill={variant === 'dark' ? '#0F110C' : 'transparent'} />
      
      {/* Circle */}
      <circle 
        cx="250" 
        cy="250" 
        r="180" 
        fill="transparent" 
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'} 
        strokeWidth="8" 
      />
      
      {/* Text "Spice Pop" */}
      <path 
        d="M130,270 C125,260 125,240 140,230 C155,220 170,225 175,235 C177,240 177,250 172,255 C167,260 160,265 145,270 C160,278 175,290 170,310 C165,320 155,330 140,330 C125,330 115,320 115,300"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M175,230 C190,220 200,220 210,235 C215,250 210,290 205,320 C202,335 195,345 180,345"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M220,245 C225,235 235,230 250,230 C265,230 275,240 275,260 C275,280 265,290 240,290"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M260,340 L230,290"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M280,260 C285,240 305,230 320,245 C335,260 335,300 320,320 C305,340 290,335 280,320"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M330,245 C340,235 350,230 365,230 C380,230 390,240 390,260 C390,280 380,290 350,290"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      <path 
        d="M375,340 L345,290"
        fill="transparent"
        stroke={variant === 'dark' ? '#F5F0E1' : '#F5F0E1'}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      {/* Chili Pepper */}
      <path 
        d="M250,100 C210,130 215,180 240,190 C265,200 280,180 270,145 C260,110 240,180 260,190"
        fill="#E94A30" 
        stroke="#E94A30"
        strokeWidth="2"
      />
      
      {/* Chili Stem */}
      <path 
        d="M240,120 C245,100 260,90 280,110"
        fill="#9CC25D"
        stroke="#9CC25D"
        strokeWidth="2"
      />
    </svg>
  );
}