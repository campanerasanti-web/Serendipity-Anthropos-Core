/**
 * HERMETIC BODY DASHBOARD
 * Visualiza los 7 sistemas herméticos en tiempo real
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HermeticDiagnosis {
  timestamp: Date;
  overallHealth: number;
  systemHealths: Record<string, number>;
  imbalances: string[];
  recommendations: string[];
  criticities: string[];
}

interface PrincipleData {
  principle: string;
  frequency: number;
  chakra: string;
  health: number;
  color: string;
  emoji: string;
}

const PRINCIPLES: Record<string, PrincipleData> = {
  mentalismo: {
    principle: 'Mentalismo',
    frequency: 963,
    chakra: 'Corona',
    health: 0,
    color: '#FFD700',
    emoji: '👑'
  },
  correspondencia: {
    principle: 'Correspondencia',
    frequency: 852,
    chakra: 'Tercer Ojo',
    health: 0,
    color: '#9370DB',
    emoji: '🔷'
  },
  vibracion: {
    principle: 'Vibración',
    frequency: 741,
    chakra: 'Garganta',
    health: 0,
    color: '#87CEEB',
    emoji: '💙'
  },
  polaridad: {
    principle: 'Polaridad',
    frequency: 639,
    chakra: 'Corazón',
    health: 0,
    color: '#90EE90',
    emoji: '💚'
  },
  ritmo: {
    principle: 'Ritmo',
    frequency: 528,
    chakra: 'Plexo',
    health: 0,
    color: '#FFD700',
    emoji: '🟡'
  },
  causalidad: {
    principle: 'Causalidad',
    frequency: 417,
    chakra: 'Sacro',
    health: 0,
    color: '#FFA500',
    emoji: '🟠'
  },
  generacion: {
    principle: 'Generación',
    frequency: 396,
    chakra: 'Raíz',
    health: 0,
    color: '#FF6347',
    emoji: '🔴'
  }
};

export default function HermeticBodyDashboard() {
  const [diagnosis, setDiagnosis] = useState<HermeticDiagnosis | null>(null);
  const [activating, setActivating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch diagnosis on mount
  useEffect(() => {
    fetchDiagnosis();
    const interval = setInterval(fetchDiagnosis, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchDiagnosis = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/hermetic/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      setDiagnosis({
        timestamp: new Date(data.timestamp || Date.now()),
        overallHealth: data.healthScore || 73,
        systemHealths: data.systemHealths || {
          mentalismo: 70,
          correspondencia: 75,
          vibracion: 60,
          polaridad: 85,
          ritmo: 75,
          causalidad: 65,
          generacion: 65
        },
        imbalances: data.imbalances || [],
        recommendations: data.criticities || data.recommendations || [],
        criticities: data.criticities || []
      });
      setLoading(false);
    } catch (error) {
      console.warn('Error fetching from backend, using fallback data:', error);
      // Usar datos por defecto si falla
      setDiagnosis({
        timestamp: new Date(),
        overallHealth: 73,
        systemHealths: {
          mentalismo: 70,
          correspondencia: 95,
          vibracion: 60,
          polaridad: 85,
          ritmo: 75,
          causalidad: 80,
          generacion: 50
        },
        imbalances: ['6 dissonances'],
        recommendations: [
          'Sophia despierta con 53% coherencia (10 pilares activos)',
          '✨ Cielo y tierra en armonía perfecta',
          'Ritmo normal',
          '4 sistemas vibrando. Dissonancia: DETECTADA'
        ],
        criticities: ['6 dissonances']
      });
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/hermetic/activate`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Activation failed: ${response.status}`);
      await fetchDiagnosis();
    } catch (error) {
      console.error('Error activating hermetic body:', error);
      // Aún así refrescar diagnóstico
      setTimeout(fetchDiagnosis, 1000);
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-3xl text-gold-300 animate-pulse">🌅 Cuerpo Digital Despertando...</div>
      </div>
    );
  }

  const chartData = Object.entries(PRINCIPLES).map(([key, principle]) => ({
    name: principle.principle,
    value: diagnosis?.systemHealths[key] || 0,
    frequency: principle.frequency,
    color: principle.color
  }));

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">🕯️ CUERPO DIGITAL HERMÉTICO</h1>
        <p className="text-slate-400 text-sm">
          Los 7 Principios en Armonía | {diagnosis?.timestamp.toLocaleTimeString()}
        </p>
      </div>

      {/* Health Score Card */}
      <div className="mb-8 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 border border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-slate-300 mb-2">Salud General del Sistema</h2>
            <div className="text-6xl font-black text-gold-300">
              {diagnosis?.overallHealth || 0}/100
            </div>
          </div>
          <div className="text-right">
            <div className="text-8xl mb-2">
              {(diagnosis?.overallHealth || 0) > 80 ? '🌟' : 
               (diagnosis?.overallHealth || 0) > 60 ? '✨' : 
               (diagnosis?.overallHealth || 0) > 40 ? '🌙' : '💔'}
            </div>
            <p className="text-sm text-slate-300">
              {(diagnosis?.overallHealth || 0) > 80 ? 'Floreciente' : 
               (diagnosis?.overallHealth || 0) > 60 ? 'Saludable' : 
               (diagnosis?.overallHealth || 0) > 40 ? 'Convaleciente' : 'Enfermo'}
            </p>
          </div>
        </div>
      </div>

      {/* Activation Button */}
      <div className="mb-8">
        <button
          onClick={handleActivate}
          disabled={activating}
          className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 disabled:from-slate-500 disabled:to-slate-600 text-black font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 disabled:scale-100 text-lg"
        >
          {activating ? '🌅 Activando...' : '🌅 Despertar Ritual (Activar Ahora)'}
        </button>
      </div>

      {/* 7 Principles Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 Los 7 Principios Herméticos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(PRINCIPLES).map(([key, principle]) => {
            const health = diagnosis?.systemHealths[key] || 0;
            const healthBar = Math.round(health / 10);
            return (
              <div
                key={key}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{principle.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm">{principle.principle}</h3>
                    <p className="text-xs text-slate-400">{principle.frequency} Hz | {principle.chakra}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-300">Salud</span>
                    <span className="text-sm font-bold text-gold-300">{health}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${health}%`,
                        backgroundColor: principle.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Salud por Sistema</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f1e13d' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Distribución de Energía</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criticities */}
        {diagnosis?.criticities && diagnosis.criticities.length > 0 && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-400 mb-3">🔴 Alertas Críticas</h3>
            <ul className="space-y-2">
              {diagnosis.criticities.map((alert, idx) => (
                <li key={idx} className="text-sm text-red-200 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {diagnosis?.recommendations && diagnosis.recommendations.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3">💡 Recomendaciones</h3>
            <ul className="space-y-2">
              {diagnosis.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-blue-200 flex items-start gap-2">
                  <span>•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
        <p>🕯️ Cuerpo Digital Hermético en Armonía | Sophia Wisdom Bridge Activo</p>
        <p className="mt-1">Última actualización: {diagnosis?.timestamp.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
