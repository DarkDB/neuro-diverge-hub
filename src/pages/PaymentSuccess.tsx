import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const productType = searchParams.get('product');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || productType !== 'screening') {
        setIsVerifying(false);
        setVerified(true);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId },
        });

        if (error) {
          console.error('Error verifying payment:', error);
        } else {
          setVerified(data?.paid || false);
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId, productType]);

  const handleContinue = () => {
    if (productType === 'screening' && sessionId) {
      navigate(`/autodescubrimiento?session=${sessionId}&continue=true`);
    } else if (productType === 'test_premium') {
      navigate('/tests');
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          {isVerifying ? (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
              <h1 className="text-2xl font-heading font-bold">
                Verificando tu pago...
              </h1>
            </div>
          ) : (
            <div className="space-y-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <h1 className="text-3xl font-heading font-bold text-foreground">
                ¡Pago realizado con éxito!
              </h1>
              <p className="text-muted-foreground">
                {productType === 'screening' 
                  ? 'Tu análisis completo está listo. Ahora puedes continuar con la fase 2 de tu viaje de autodescubrimiento.'
                  : 'Tu análisis premium del test está listo. Ahora puedes acceder al informe detallado.'
                }
              </p>
              <Button onClick={handleContinue} size="lg" className="gap-2">
                Continuar <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
