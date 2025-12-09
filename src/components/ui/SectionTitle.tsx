import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
}

export function SectionTitle({ 
  children, 
  subtitle, 
  className, 
  as: Component = 'h2',
  align = 'left'
}: SectionTitleProps) {
  return (
    <div className={cn(
      'mb-8',
      align === 'center' && 'text-center',
      className
    )}>
      <Component className={cn(
        'font-heading font-semibold text-foreground',
        Component === 'h1' && 'text-3xl md:text-4xl lg:text-5xl',
        Component === 'h2' && 'text-2xl md:text-3xl',
        Component === 'h3' && 'text-xl md:text-2xl'
      )}>
        {children}
      </Component>
      {subtitle && (
        <p className={cn(
          'mt-3 text-muted-foreground',
          Component === 'h1' ? 'text-lg md:text-xl' : 'text-base'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
