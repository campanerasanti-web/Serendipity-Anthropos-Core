import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { Sparkles, Lightbulb } from 'lucide-react';

// Simple Card component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border ${className}`}>{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

interface DailyMetric {
  date: string;
  narrative: string | null;
  emoji: string;
  confidence_score: number;
  pace_vs_breakeven: number;
  days_to_crisis: number | null;
}

/**
 * Componente que muestra el insight del día en lenguaje natural
 * Generado automáticamente por IA basado en métricas diarias
 */
export const DailyInsightCard = () => {
  const today = new Date().toISOString().split('T')[0];

  const { data: insight, isLoading, error } = useQuery({
    queryKey: ['daily-insight', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('date, narrative, emoji, confidence_score, pace_vs_breakeven, days_to_crisis')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as DailyMetric | null;
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });

  if (isLoading) {
    return (
      <Card className='bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent border-2 border-amber-200 dark:border-amber-800 animate-pulse'>
        <CardContent className='pt-6'>
          <div className='h-24 bg-muted rounded-lg' />
        </CardContent>
      </Card>
    );
  }

  if (!insight) {
    return null;
  }

  const getEmoji = () => insight.emoji || '🤔';
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className='bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent border-2 border-amber-200 dark:border-amber-800'>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4'>
          {/* Emoji grande */}
          <div className='text-5xl flex-shrink-0'>{getEmoji()}</div>

          {/* Contenido del insight */}
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <Lightbulb className='h-4 w-4 text-amber-600' />
              <h3 className='font-bold text-amber-900 dark:text-amber-100'>
                Daily Insight
              </h3>
            </div>

            {/* Narrativa generada por IA */}
            {insight.narrative && (
              <p className='text-sm text-amber-800 dark:text-amber-200 mb-4 leading-relaxed'>
                {insight.narrative}
              </p>
            )}

            {/* Métricas rápidas */}
            <div className='grid grid-cols-2 gap-3 text-xs'>
              <div>
                <p className='text-amber-600 dark:text-amber-400 font-medium'>
                  Pace Today
                </p>
                <p className='text-lg font-bold text-amber-900 dark:text-amber-100'>
                  {insight.pace_vs_breakeven?.toFixed(1)}%
                </p>
              </div>

              <div>
                <p className={`font-medium ${getConfidenceColor(insight.confidence_score || 0)}`}>
                  Confidence
                </p>
                <p className={`text-lg font-bold ${getConfidenceColor(insight.confidence_score || 0)}`}>
                  {insight.confidence_score?.toFixed(0)}%
                </p>
              </div>

              {insight.days_to_crisis && insight.days_to_crisis < 30 && (
                <div className='col-span-2 bg-red-100 dark:bg-red-900/20 p-2 rounded border border-red-300 dark:border-red-700'>
                  <p className='text-red-700 dark:text-red-200 text-xs font-medium'>
                    ⚠️ Crisis en {insight.days_to_crisis} días si continúa el ritmo actual
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
