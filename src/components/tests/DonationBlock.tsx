import { useState } from 'react';
import { Heart, Loader2, Coffee } from 'lucide-react';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PRESET_AMOUNTS = [2, 3, 5, 10];

export function DonationBlock() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  const effectiveAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonate = async () => {
    if (effectiveAmount < 2) {
      toast.error('El importe mínimo es 2€');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { amount_cents: Math.round(effectiveAmount * 100) },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Error al procesar la donación. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentBlock className="text-center border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
        <Heart className="w-7 h-7 text-primary" />
      </div>
      
      <h3 className="font-heading font-semibold text-xl mb-2">
        ¡Gracias por completar el test!
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        Si valoras este espacio y quieres ayudarme a seguir investigando sobre neurodivergencia, 
        puedes realizar una pequeña donación. ¡Tú eliges la cantidad!
      </p>

      {/* Amount selection */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => { setSelectedAmount(amount); setIsCustom(false); }}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              !isCustom && selectedAmount === amount
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary/50 text-foreground'
            }`}
          >
            {amount}€
          </button>
        ))}
        <button
          onClick={() => setIsCustom(true)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            isCustom
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border hover:border-primary/50 text-foreground'
          }`}
        >
          Otra
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <input
            type="number"
            min="2"
            step="1"
            placeholder="5"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-muted-foreground font-medium">€</span>
        </div>
      )}

      <Button 
        onClick={handleDonate} 
        disabled={loading || effectiveAmount < 2} 
        className="gap-2 px-8"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Coffee className="w-4 h-4" />
            Aportar mi granito de arena
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Pago 100% seguro con tarjeta o móvil vía Stripe.
      </p>
    </ContentBlock>
  );
}
