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
  // Use a more accurate SVG version of the logo that looks like the image
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background (optional based on variant) */}
      {variant === 'dark' && <rect width="500" height="500" fill="#0F110C" />}
      
      {/* Circle outline */}
      <circle 
        cx="250" 
        cy="250" 
        r="170" 
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="6" 
      />
      
      {/* The word "Spice" with cursive styling */}
      <path 
        d="M125,235 C125,205 160,205 170,220 C180,235 165,250 140,255 C160,260 185,280 175,310 C165,330 140,330 125,315"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path 
        d="M190,230 C210,220 225,235 225,250 C225,295 200,345 185,345"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path 
        d="M235,240 C245,225 265,220 275,240 C285,260 265,275 245,275 M260,320 L235,275"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path 
        d="M290,230 C300,220 320,220 325,240 C330,260 320,290 300,315 C285,335 275,315 290,300"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* The word "Pop" with cursive styling */}
      <path 
        d="M325,240 C335,225 360,225 365,240 C370,255 355,275 330,275 M355,320 L330,275"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path 
        d="M375,230 C405,220 415,260 380,275 C410,290 395,340 365,330"
        fill="transparent" 
        stroke="#F5F0E1" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Red Chili Pepper */}
      <path 
        d="M250,120 C230,130 230,150 240,175 C250,200 260,175 260,160 C260,145 245,130 250,120"
        fill="#E94A30"
      />
      
      {/* Green Chili Stem */}
      <path 
        d="M245,125 C250,110 265,105 275,115"
        fill="#9CC25D"
        stroke="#9CC25D"
        strokeWidth="2"
      />
    </svg>
  );
}