import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUnifiedDashboard, fetchTodaysInsight } from '../services/queries';
import {
  AlertCircle,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
import Card from './ui/Card';
import SectionTitle from './ui/SectionTitle';
import { DynamicBackground } from './ui/DynamicBackground';
import { FlowerOfTime } from './ui/FlowerOfTime';
import { SoulMessages } from './ui/SoulMessages';
import { SolfeggioPlayer } from './ui/SolfeggioPlayer';
import { AgentsSidebar } from './ui/AgentsSidebar';
import { GardenEnergyPanel } from './ui/GardenEnergyPanel';
import { BonusOrb } from './ui/BonusOrb';
import { GardenSparkles } from './ui/GardenSparkles';
import { GuardianQuestions } from './ui/GuardianQuestions';
import { GardenTimeline } from './ui/GardenTimeline';
import { usePaymentFolder } from '../hooks/usePaymentFolder';
import { getActiveWipCount } from '../services/gardenMemory';

// ===== DASHBOARD PRINCIPAL =====
export default function SofiaDashboard() {
  const [anthroposMood, setAnthroposMood] = useState<'flowing' | 'stressed' | 'fragmented' | 'fertile'>(
    'flowing'
  );
  const [highlightIncome, setHighlightIncome] = useState(false);
  const [sparklesActive, setSparklesActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wipCount, setWipCount] = useState(0);
  const [bonusPct, setBonusPct] = useState(0);
  const [incomeBoost, setIncomeBoost] = useState(0);
  const { requestFolderAccess, unclassifiedDocs, isWatching } = usePaymentFolder();

  // Cargar WIP count desde memoria local
  useEffect(() => {
    const storedWipCount = getActiveWipCount();
    if (storedWipCount > 0) {
      setWipCount(storedWipCount);
    }
  }, []);

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['dashboard', 2, 2026],
    queryFn: () => fetchUnifiedDashboard(2, 2026),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: insight } = useQuery({
    queryKey: ['dailyInsight'],
    queryFn: fetchTodaysInsight,
    retry: 1,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchMood = async () => {
      try {
        const response = await fetch('/api/anthropos/run', { method: 'POST' });
        if (!response.ok) return;
        const data = await response.json();
        const rawMood =
          data?.results?.anthroposCore?.state ||
          data?.results?.anthropos_core?.state ||
          data?.results?.anthropos?.state ||
          'flowing';
        const nextMood = ['flowing', 'stressed', 'fragmented', 'fertile'].includes(rawMood)
          ? rawMood
          : 'flowing';

        if (isMounted) setAnthroposMood(nextMood);
      } catch (e) {
        // Mantener mood por defecto si falla
      }
    };

    fetchMood();

    return () => {
      isMounted = false;
    };
  }, []);

  // ===== ESTADOS DE CARGA Y ERROR =====
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#3b82f6] to-[#451a03]">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400 animate-spin" size={20} />
          <span className="text-white">Sincronizando con Sofia...</span>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#3b82f6] to-[#451a03]">
        <div className="text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={32} />
          <p className="text-red-400 mb-4">Error al cargar los datos</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totalIncomes = stats?.total_incomes ?? 0;
  const totalFixedCosts = stats?.total_fixed_costs ?? 0;
  const balance = Number(totalIncomes - totalFixedCosts);
  const visualIncomes = totalIncomes + incomeBoost;
  const now = new Date();
  const dayOfMonth = now.getDate();
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyIncomeEstimate = dayOfMonth > 0 ? visualIncomes / dayOfMonth : visualIncomes;
  const dailyTarget = Math.max(totalFixedCosts / totalDaysInMonth, 1);
  const gardenState = useMemo(() => {
    if (totalIncomes <= 0) {
      return {
        title: 'Semillas en reposo',
        message: 'El jardin descansa. Un gesto simple hoy puede iniciar el brote.',
      };
    }

    if (balance < 0) {
      return {
        title: 'Raices sensibles',
        message: 'Respira. Prioriza cuidado y presencia antes de empujar el ritmo.',
      };
    }

    if (anthroposMood === 'fragmented') {
      return {
        title: 'Fragmentos buscando union',
        message: 'Hoy basta un acto de coherencia. Une el equipo con una palabra clara.',
      };
    }

    if (anthroposMood === 'stressed') {
      return {
        title: 'Jardin en tension',
        message: 'Baja la velocidad. El orden suave abre la puerta al flujo.',
      };
    }

    if (anthroposMood === 'fertile') {
      return {
        title: 'Suelo fertil',
        message: 'Hay nutriente disponible. Escucha lo que el equipo quiere sembrar.',
      };
    }

    return {
      title: 'Flujo sereno',
      message: 'El jardin respira contigo. Mantente presente y protege el ritmo.',
    };
  }, [anthroposMood, balance, totalIncomes]);

  const guardianAccess = useMemo(() => {
    if (balance < 0) {
      return {
        privilegeLevel: 'seed' as const,
        allowedAgents: ['self_gardener', 'ops_gardener'] as const,
      };
    }

    if (anthroposMood === 'fertile') {
      return {
        privilegeLevel: 'sovereign' as const,
        allowedAgents: ['ops_gardener', 'security_gardener', 'anthropos_core', 'self_gardener'] as const,
      };
    }

    return {
      privilegeLevel: 'bloom' as const,
      allowedAgents: ['ops_gardener', 'security_gardener', 'self_gardener'] as const,
    };
  }, [anthroposMood, balance]);

  useEffect(() => {
    setHighlightIncome(true);
    const timer = setTimeout(() => setHighlightIncome(false), 1200);
    return () => clearTimeout(timer);
  }, [totalIncomes]);

  useEffect(() => {
    const handler = () => {
      setSparklesActive(true);
      setHighlightIncome(true);
      setIncomeBoost((prev) => prev + 100);
      setBonusPct((prev) => Math.min(prev + 5, 25));
      setWipCount((prev) => prev + 1);

      const timer = setTimeout(() => {
        setSparklesActive(false);
        setHighlightIncome(false);
      }, 1600);

      return () => clearTimeout(timer);
    };

    window.addEventListener('garden-document', handler);
    return () => window.removeEventListener('garden-document', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0ebe1] via-[#e3f2dd] to-[#d9e9d2]">
      <SolfeggioPlayer />
      <AgentsSidebar
        privilegeLevel={guardianAccess.privilegeLevel}
        allowedAgents={[...guardianAccess.allowedAgents]}
      />
      <div className="relative overflow-hidden">
        <DynamicBackground mood={anthroposMood} />
        <GardenSparkles active={sparklesActive} />
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* HEADER */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-colors"
                >
                  Menu del Jardin ▾
                </button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-emerald-300 shadow-xl overflow-hidden z-30">
                    <button className="w-full text-left px-4 py-3 text-sm text-emerald-800 hover:bg-emerald-50">
                      Vista del Jardin
                    </button>
                    <button
                      onClick={() => {
                        requestFolderAccess();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <FolderOpen size={16} />
                      Conectar Pagos
                      {isWatching && <span className="ml-auto text-xs text-green-600">●</span>}
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-emerald-800 hover:bg-emerald-50">
                      Rituales y Presencia
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-emerald-800 hover:bg-emerald-50">
                      Guardianes
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-lime-700 mb-2">
                  Templo Sofia ✨
                </h1>
                <p className="text-emerald-700 text-lg">
                  Jardín biófilo de inteligencia financiera
                </p>
              </div>
            </div>
          </div>

          {/* INSIGHT DEL DÍA */}
          {insight?.narrative && (
            <div className="mb-8">
              <Card
                icon={Sparkles}
                title="💭 Insight del Día"
                color="purple"
                variant="bordered"
              >
                <span className="text-sm font-semibold text-purple-300 block mb-2">
                  Confianza: {(insight.confidence_score * 100).toFixed(0)}%
                </span>
                <p className="text-lg italic text-gray-200">"{insight.narrative}"</p>
              </Card>
            </div>
          )}

          {/* SECTION: MENSAJES DEL ALMA */}
          <div className="mb-8">
            <SoulMessages />
          </div>

          {/* SECTION: FLOR DEL TIEMPO */}
          <div className="mb-8">
            <FlowerOfTime
              dayOfMonth={dayOfMonth}
              totalDaysInMonth={totalDaysInMonth}
              dailyIncome={dailyIncomeEstimate}
              dailyTarget={dailyTarget}
            />
          </div>

          <div className="mb-10">
            <SectionTitle
              icon={Sparkles}
              title="Orbe del Bonus"
              subtitle="Cada ingreso eleva la energia viva"
            />
            <BonusOrb bonusPct={bonusPct || (totalIncomes > 0 ? 5 : 0)} highlight={highlightIncome} />
          </div>

          {/* PREGUNTAS DEL GUARDIAN */}
          {unclassifiedDocs.length > 0 && (
            <div className="mb-10">
              <GuardianQuestions
                documents={unclassifiedDocs}
                onDocumentClassified={(fileName) => {
                  // Refrescar lista después de clasificar
                  console.log('Documento clasificado:', fileName);
                }}
              />
            </div>
          )}

          {/* SECTION: JARDIN VIVO */}
          <SectionTitle
            icon={Sparkles}
            title="Jardin Vivo"
            subtitle="Cuidado, presencia y ritmo"
          />

          <div className="mb-10">
            <GardenEnergyPanel
              totalIncomes={visualIncomes}
              totalFixedCosts={totalFixedCosts}
              wipCount={wipCount}
              highlightIncome={highlightIncome}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card title={`Estado del Jardin: ${gardenState.title}`} color="purple" variant="subtle">
              <p className="text-gray-200 leading-relaxed">{gardenState.message}</p>
            </Card>

            <Card title="Ritual del Dia" color="green" variant="subtle">
              <p className="text-gray-200 leading-relaxed">
                {insight?.narrative
                  ? `"${insight.narrative}"`
                  : 'Un gesto simple y consciente riega mas que diez impulsos apresurados.'}
              </p>
            </Card>
          </div>

          {/* LINEA DE TIEMPO */}
          <div className="mb-12">
            <GardenTimeline />
          </div>

          <div className="mb-12">
            <Card title="Compromiso del Cuidador" color="blue" variant="subtle">
              <p className="text-gray-200 leading-relaxed">
                Hoy cuidamos el ritmo, escuchamos al equipo y respondemos con presencia. El jardin vive
                cuando nosotros vivimos en el.
              </p>
            </Card>
          </div>

          {/* FOOTER */}
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              ✨ Templo Sofia • Última actualización:{' '}
              {new Date().toLocaleTimeString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
