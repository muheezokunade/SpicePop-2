import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loading({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingProps) {
  let sizeClass = 'w-6 h-6';
  
  if (size === 'sm') {
    sizeClass = 'w-4 h-4';
  } else if (size === 'lg') {
    sizeClass = 'w-10 h-10';
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin text-primary`} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}