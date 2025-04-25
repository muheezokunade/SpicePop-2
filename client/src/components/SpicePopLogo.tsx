import { cn } from '@/lib/utils';

interface SpicePopLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function SpicePopLogo({ className, width = 100, height = 100 }: SpicePopLogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={width} 
      height={height}
      className={cn('', className)}
    >
      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#F5F0E1" strokeWidth="2" />
      <g>
        {/* Text "Spice" */}
        <path
          d="M23,38c0-1.5,1.2-2.7,2.7-2.7c1.5,0,2.7,1.2,2.7,2.7c0,1.5-1.2,2.7-2.7,2.7C24.2,40.6,23,39.4,23,38z M23,43h5.4v19.5H23V43z"
          fill="#F5F0E1"
        />
        <path
          d="M31.5,43h5.1v2.8h0.1c1.4-2.1,3.4-3.3,6.4-3.3c5.4,0,7.1,3.8,7.1,8.5v11.5h-5.4V52c0-2.8-0.8-4.7-3.4-4.7c-2.9,0-4.5,1.6-4.5,5.4v9.8h-5.4V43z"
          fill="#F5F0E1"
        />
      </g>
      <g>
        {/* Red chili pepper */}
        <path
          d="M65,35c0,0-5,5-5,15s5,15,5,15s5-5,5-15S65,35,65,35z"
          fill="#E94A30"
        />
        {/* Green stem */}
        <path
          d="M65,35c0,0,3-5,5-5s5,5,0,10C65,35,65,35,65,35z"
          fill="#9CC25D"
        />
      </g>
      <g>
        {/* Text "Pop" */}
        <path
          d="M41,60v-5h4c2.8,0,4.2-1.7,4.2-4.2c0-2.5-1.4-4.2-4.2-4.2h-9v19.5h5V60H41z M41,47.5h3.4c0.8,0,1.4,0.6,1.4,1.4c0,0.8-0.6,1.4-1.4,1.4H41V47.5z"
          fill="#F5F0E1"
        />
        <path
          d="M56,62.5c-3.4,0-6.1-2.8-6.1-6.2c0-3.4,2.7-6.2,6.1-6.2c3.4,0,6.1,2.8,6.1,6.2C62.1,59.7,59.4,62.5,56,62.5z M56,54.3c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2C58,55.2,57.1,54.3,56,54.3z"
          fill="#F5F0E1"
        />
        <path
          d="M65.1,62.5c-3.4,0-6.1-2.8-6.1-6.2c0-3.4,2.7-6.2,6.1-6.2c3.4,0,6.1,2.8,6.1,6.2C71.2,59.7,68.5,62.5,65.1,62.5z M65.1,54.3c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2C67.1,55.2,66.2,54.3,65.1,54.3z"
          fill="#F5F0E1"
        />
      </g>
    </svg>
  );
}

export default SpicePopLogo;
