import { useEffect, useState } from 'react';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { supabase } from '../supabase/supabaseClient';
import { Toaster, toast } from 'sonner';
import { AlertCircle, TrendingUp, Heart, Zap } from 'lucide-react';

interface Alert {
  id: string;
  type: 'crisis' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

/**
 * Sistema inteligente de alertas en tiempo real
 * Monitorea cambios y notifica al CEO de eventos importantes
 *
 * Tipos de alertas:
 * - CRISIS: Net flow negativo por 2+ días
 * - SUCCESS: Peace Fund alcanzó límite
 * - WARNING: Falta 5% para breakeven
 * - INFO: Nuevo hito alcanzado
 */
export const AlertSystem = () => {
  const [previousMetrics, setPreviousMetrics] = useState<any>(null);
  const [alertCount, setAlertCount] = useState(0);

  // Monitorear cambios en invoices
  useRealtimeSubscription({
    table: 'invoices',
    event: 'INSERT',
    onEvent: async (event) => {
      const newInvoice = event.new;

      // Toast inmediato
      toast.success(
        `Nueva factura de $${newInvoice.total_amount?.toLocaleString() || '0'} registrada`,
        {
          icon: <TrendingUp className='h-4 w-4 text-green-500' />,
          duration: 5000,
        }
      );

      // Verificar si alcanzó un hito
      await checkMilestones(newInvoice.total_amount);
    },
  });

  // Monitorear cambios en fixed_costs
  useRealtimeSubscription({
    table: 'fixed_costs',
    event: 'UPDATE',
    onEvent: (event) => {
      toast.info('Costos fijos actualizados', {
        icon: <AlertCircle className='h-4 w-4' />,
        duration: 3000,
      });
    },
  });

  // Monitorear daily_metrics para alertas críticas
  useRealtimeSubscription({
    table: 'daily_metrics',
    event: '*',
    onEvent: (event) => {
      const metrics = event.new;

      // CRISIS ALERT: Net flow negativo
      if (metrics.net_flow_today < 0) {
        toast.error('⚠️ Alerta: Gastos superaron ingresos hoy', {
          description: `Net flow: $${metrics.net_flow_today}`,
          duration: 10000,
        });
      }

      // SUCCESS ALERT: Excedente significativo
      if (metrics.pace_vs_breakeven >= 100) {
        toast.success('🟢 ¡Paz alcanzada! Breakeven superado', {
          icon: <Heart className='h-4 w-4 text-red-500' />,
          duration: 7000,
        });
      }

      // WARNING ALERT: Cerca del breakeven
      if (metrics.pace_vs_breakeven >= 95 && metrics.pace_vs_breakeven < 100) {
        toast.warning('Casi en paz, faltan $' + 
          Math.round((100 - metrics.pace_vs_breakeven) * metrics.costs_today / 100),
          {
            description: 'Poco a poco, cada venta cuenta',
            icon: <Zap className='h-4 w-4' />,
            duration: 6000,
          }
        );
      }
    },
  });

  const checkMilestones = async (amount: number) => {
    // Verificar si esta es la 10ª factura del mes
    const now = new Date();
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: false })
      .gte('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
      .lt('created_at', new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString());

    if (!error && invoices && invoices.length === 10) {
      toast.success('🏆 ¡Hito! 10 facturas registradas este mes', {
        description: 'El trabajo constante trae resultados',
        duration: 8000,
      });
    }

    setAlertCount((prev) => prev + 1);
  };

  return (
    <Toaster
      position='bottom-right'
      richColors
      expand
      theme='dark'
    />
  );
};
