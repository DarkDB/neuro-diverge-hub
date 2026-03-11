import { useState, useEffect } from 'react';
import { Euro, Save, Loader2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductPricing {
  id: string;
  product_key: string;
  product_name: string;
  description: string | null;
  price_cents: number;
  is_free: boolean;
  stripe_price_id: string | null;
  is_active: boolean;
  updated_at: string;
}

export function PricingTab() {
  const [products, setProducts] = useState<ProductPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { price_euros: string; is_free: boolean }>>({});

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_pricing')
        .select('*')
        .order('product_key');

      if (error) throw error;
      
      const pricing = (data || []) as unknown as ProductPricing[];
      setProducts(pricing);
      
      const values: Record<string, { price_euros: string; is_free: boolean }> = {};
      pricing.forEach((p) => {
        values[p.product_key] = {
          price_euros: (p.price_cents / 100).toFixed(2),
          is_free: p.is_free,
        };
      });
      setEditValues(values);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Error al cargar los precios');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(productKey: string) {
    const values = editValues[productKey];
    if (!values) return;

    if (!values.is_free && (!values.price_euros || parseFloat(values.price_euros) <= 0)) {
      toast.error('Introduce un precio válido mayor que 0');
      return;
    }

    setSavingKey(productKey);
    try {
      const priceCents = values.is_free ? 0 : Math.round(parseFloat(values.price_euros) * 100);

      const { data, error } = await supabase.functions.invoke('update-pricing', {
        body: {
          product_key: productKey,
          price_cents: priceCents,
          is_free: values.is_free,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Precio actualizado correctamente');
      fetchPricing();
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Error al actualizar el precio');
    } finally {
      setSavingKey(null);
    }
  }

  function updateEditValue(productKey: string, field: string, value: any) {
    setEditValues(prev => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        [field]: value,
      },
    }));
  }

  const getProductIcon = (key: string) => {
    switch (key) {
      case 'screening': return '🧠';
      case 'test_premium': return '📊';
      default: return '📦';
    }
  };

  const getProductLabel = (key: string) => {
    switch (key) {
      case 'screening': return 'Cuestionario de Autodescubrimiento';
      case 'test_premium': return 'Análisis Premium de Tests';
      default: return key;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Gestión de Precios</h2>
        <p className="text-sm text-muted-foreground">
          Configura los precios de los productos. Los cambios se sincronizan automáticamente con Stripe.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => {
          const values = editValues[product.product_key];
          if (!values) return null;

          const hasChanged = 
            values.is_free !== product.is_free ||
            (!values.is_free && Math.round(parseFloat(values.price_euros || '0') * 100) !== product.price_cents);

          return (
            <Card key={product.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getProductIcon(product.product_key)}</span>
                    <div>
                      <CardTitle className="text-lg">{getProductLabel(product.product_key)}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={product.is_free ? 'secondary' : 'default'}>
                    {product.is_free ? 'Gratis' : `${(product.price_cents / 100).toFixed(2)}€`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Free toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Gratuito</Label>
                      <p className="text-xs text-muted-foreground">Los usuarios accederán sin pagar</p>
                    </div>
                  </div>
                  <Switch
                    checked={values.is_free}
                    onCheckedChange={(checked) => updateEditValue(product.product_key, 'is_free', checked)}
                  />
                </div>

                {/* Price input */}
                {!values.is_free && (
                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0.50"
                        value={values.price_euros}
                        onChange={(e) => updateEditValue(product.product_key, 'price_euros', e.target.value)}
                        placeholder="0.00"
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">EUR</span>
                    </div>
                  </div>
                )}

                {/* Save button */}
                <Button
                  onClick={() => handleSave(product.product_key)}
                  disabled={!hasChanged || savingKey === product.product_key}
                  className="w-full"
                  variant={hasChanged ? 'default' : 'outline'}
                >
                  {savingKey === product.product_key ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>

                {/* Last updated */}
                <p className="text-xs text-muted-foreground text-center">
                  Última actualización: {new Date(product.updated_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
