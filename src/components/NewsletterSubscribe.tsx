import { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: "Por favor, introduce un email válido" }).max(255);

interface NewsletterSubscribeProps {
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

export function NewsletterSubscribe({ variant = 'default', className = '' }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: validation.data });

      if (error) {
        if (error.code === '23505') {
          toast.info('Este email ya está suscrito a nuestra newsletter');
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
        toast.success('¡Te has suscrito correctamente!');
      }
    } catch (error: any) {
      console.error('Error subscribing:', error);
      toast.error('Error al suscribirse. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 ${className}`}>
        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
        <div>
          <p className="font-medium text-foreground">¡Gracias por suscribirte!</p>
          <p className="text-sm text-muted-foreground">Recibirás nuestras novedades en tu correo.</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suscribir'}
        </Button>
      </form>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg">Newsletter</h3>
            <p className="text-sm text-muted-foreground">Recibe recursos y novedades</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="w-full gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Suscribirme
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Sin spam. Puedes darte de baja en cualquier momento.
          </p>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-primary" />
        <div>
          <h3 className="font-heading font-semibold">Suscríbete a nuestra newsletter</h3>
          <p className="text-sm text-muted-foreground">Recibe recursos, guías y novedades sobre neurodivergencia.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Suscribirme
            </>
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Sin spam. Puedes darte de baja en cualquier momento.
      </p>
    </div>
  );
}
