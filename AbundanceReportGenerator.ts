import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const generateAbundanceReport = async (userId: string) => {
  try {
    // 1. Llamada a la RPC segura que creamos para obtener los totales
    const { data: stats, error: statsError } = await supabase
      .rpc('get_monthly_stats');

    if (statsError) throw statsError;

    // 2. Obtener el estado del Fondo de Paz (5% del excedente)
    const { data: costs } = await supabase.from("fixed_costs").select("*").maybeSingle();
    const totalCosts = (costs?.payroll || 0) + (costs?.rent || 0) + (costs?.evn || 0);
    const surplus = stats.total_invoiced > totalCosts ? stats.total_invoiced - totalCosts : 0;
    const peaceFund = surplus * 0.05;

    // 3. Preparar el envío a la Edge Function de PDF
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        reportType: 'WEEKLY_ABUNDANCE',
        data: {
          period: "Febrero 2026 - Semana 2",
          invoiced: stats.total_invoiced,
          survivalGoal: totalCosts,
          peaceFund: peaceFund,
          message: "Làm tốt lắm! Nhà an toàn, lương an toàn. (¡Buen trabajo! Hogar seguro, salario seguro.)"
        }
      }
    });

    if (error) throw error;
    
    toast.success("Reporte de Abundancia generado con éxito. 📄✨");
    return data.url; // URL del PDF generado
    
  } catch (err) {
    console.error("Error al generar reporte:", err);
    toast.error("El Bibliotecario no pudo procesar el reporte. Verifica la conexión.");
  }
};
<Button 
  onClick={generateAbundanceReport}
  className="relative group overflow-hidden bg-slate-900 border border-primary/20 hover:border-primary transition-all h-16 w-full"
>
  <div className="absolute left-4 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
  <span className="ml-4 font-display font-bold uppercase tracking-widest text-[11px]">
    Generar Espejo de Abundancia (PDF)
  </span>
</Button>