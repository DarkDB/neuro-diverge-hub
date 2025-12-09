import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, href, className }: FeatureCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'group block p-6 rounded-xl border border-border bg-card',
        'transition-all duration-300 hover:shadow-lg hover:border-primary/30',
        'focus-ring',
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm flex-1 mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
          <span>Explorar</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
