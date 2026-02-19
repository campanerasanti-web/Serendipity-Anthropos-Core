import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../src/lib/supabase'; // Ruta corregida al monorepo
// import { useAuth } from '@/context/AuthContext'; // AuthContext no encontrado, comentar temporalmente
import { useTranslation } from 'react-i18next';

// Definición de la "Verdad" del sistema
interface SystemState {
  financialHealth: 'SURVIVAL' | 'STABLE' | 'ABUNDANCE';
  reserveFund: number;
  pendingTasks: number;
  lastSync: Date;
}

export const useSerendipityCore = () => {
  // const { user, isCeo } = useAuth(); // Desactivado hasta que AuthContext esté disponible
  const { t, i18n } = useTranslation();
  
  // Estado Neuronal Central
  const [systemState, setSystemState] = useState<SystemState>({
    financialHealth: 'SURVIVAL',
    reserveFund: 0,
    pendingTasks: 0,
    lastSync: new Date()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. SINAPSIS: Conexión con el "Bibliotecario" (Base de Datos)
  const refreshCoreMetrics = useCallback(async () => {
    setLoading(true);
    try {
      // a. Traer Facturación
      const { data: invoices } = await supabase.from('invoices').select('total_amount');
      const totalInvoiced = invoices?.reduce((sum: number, inv: { total_amount?: number }) => sum + (inv.total_amount || 0), 0) || 0;

      // b. Traer Costos (Punto Cero)
      const { data: costs } = await supabase.from('fixed_costs').select('*').maybeSingle();
      const zeroPoint = (costs?.payroll || 0) + (costs?.rent || 0) + (costs?.evn || 0);

      // c. Calcular Salud del Sistema
      let health: SystemState['financialHealth'] = 'SURVIVAL';
      let reserve = 0;

      if (totalInvoiced >= zeroPoint) {
        health = 'STABLE';
        const surplus = totalInvoiced - zeroPoint;
        reserve = surplus * 0.05; // 5% Fondo de Paz
        if (reserve > 5000) health = 'ABUNDANCE';
      }

      setSystemState(prev => ({
        ...prev,
        financialHealth: health,
        reserveFund: reserve,
        lastSync: new Date()
      }));

    } catch (err) {
      setError("Error en la sinapsis con el Bibliotecario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. SINAPSIS: Conexión con el Exterior (IA Gemini)
  const consultLibrarian = async (prompt: string) => {
    // Aquí conectamos con tu Edge Function de Gemini
    try {
      const { data, error } = await supabase.functions.invoke('gemini-adviser', {
        body: { prompt, context: systemState } // Le damos contexto del estado actual
      });
      if (error) throw error;
      return data.advice;
    } catch (err) {
      console.error("El Bibliotecario no responde:", err);
      return null;
    }
  };

  // 3. SINAPSIS: Acción Física (Guardar Semilla)
  const sowDataSeed = async (rawData: any) => {
    // Lógica unificada para guardar gastos o ingresos
    // Detecta tipo y envía a la tabla correcta
    // ...
    await refreshCoreMetrics(); // Recalcular todo después de sembrar
    return { success: true, message: "Semilla plantada en el Templo Digital" };
  };

  // Efecto inicial: Despertar la red al cargar
  // useEffect(() => {
  //   if (user) refreshCoreMetrics();
  // }, [user, refreshCoreMetrics]);

  // Exponemos solo lo necesario al "Jardinero" (Frontend)
  return {
    // Estado
    nucleus: systemState,
    isLoading: loading,
    alerts: error,
    
    // Identidad
    identity: {
      // role: isCeo ? 'CEO' : 'OPERATOR',
      role: 'OPERATOR',
      language: i18n.language
    },

    // Acciones (Habilidades)
    actions: {
      refresh: refreshCoreMetrics,
      consultAI: consultLibrarian,
      plantSeed: sowDataSeed
    }
  };
};
