import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  style?: CSSProperties;
}

const variantStyles = {
  default: 'bg-card border-border/50',
  highlight: 'bg-accent/50 border-primary/20',
  warning: 'bg-warning/10 border-warning/30',
  success: 'bg-success/10 border-success/30',
};

export function ContentBlock({ children, className, variant = 'default', style }: ContentBlockProps) {
  return (
    <div 
      className={cn(
        'rounded-xl p-6 md:p-8 border transition-all duration-300',
        'shadow-sm hover:shadow-md',
        variantStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
