import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'footer';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  // Define colors based on variant
  const bgColor = variant === 'default' ? 'bg-dark' : 'bg-cream';
  const textColor = variant === 'default' ? 'text-cream' : 'text-dark';
  const nameColor = variant === 'default' ? 'text-dark' : 'text-cream';

  // Define sizes
  const logoSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl'
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn('relative', logoSizes[size])}>
        <div className={`rounded-full ${bgColor} p-1`}>
          <div className="flex items-center justify-center h-full">
            <span className={`${textColor} font-poppins font-bold`}>
              SP
            </span>
          </div>
        </div>
      </div>
      <span className={cn('ml-2 font-bold font-poppins', textSizes[size], nameColor !== 'text-dark' && nameColor)}>
        SpicePop
      </span>
    </div>
  );
}

export function SpicePopIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn('w-full h-full', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#F5F0E1" strokeWidth="2" />
      <path 
        d="M20,50 C20,30 35,15 55,15 Q65,15 75,25 T80,50 Q80,70 65,80 T35,80 Q25,70 20,50 Z" 
        fill="transparent"
        stroke="#F5F0E1" 
        strokeWidth="2" 
      />
      <path 
        d="M45,30 Q55,20 65,30 T65,60 Q55,75 45,60 T45,30" 
        fill="#E94A30" 
      />
      <path 
        d="M45,30 Q50,25 55,25 T65,30 Q62,25 58,20 T45,30" 
        fill="#9CC25D" 
      />
    </svg>
  );
}
