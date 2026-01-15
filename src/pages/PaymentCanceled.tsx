import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <XCircle className="w-20 h-20 text-destructive mx-auto" />
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Pago cancelado
          </h1>
          <p className="text-muted-foreground">
            No te preocupes, no se ha realizado ningún cargo. Puedes intentarlo de nuevo cuando quieras.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <Button onClick={() => navigate('/')}>
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
