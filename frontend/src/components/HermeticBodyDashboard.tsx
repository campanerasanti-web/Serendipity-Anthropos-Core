import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity, CheckCircle, TrendingUp, Users } from 'lucide-react';

const stats = [
  { label: 'Órdenes nuevas', value: 12, icon: Activity, color: 'bg-blue-600' },
  { label: 'Facturados', value: 8, icon: CheckCircle, color: 'bg-green-600' },
  { label: 'En WIP', value: 4, icon: TrendingUp, color: 'bg-yellow-500' },
  { label: 'Total acumulado', value: 50, icon: Users, color: 'bg-purple-600' },
];

const chartData = [
  { name: 'Ene', value: 10 },
  { name: 'Feb', value: 20 },
  { name: 'Mar', value: 15 },
  { name: 'Abr', value: 30 },
  { name: 'May', value: 25 },
  { name: 'Jun', value: 40 },
];

export default function HermeticBodyDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100 p-6">
      <motion.h1
        className="text-3xl font-extrabold mb-8 text-center tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Templo Digital · Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            className={twMerge(
              'rounded-xl shadow-lg p-6 flex items-center gap-4 bg-zinc-900 border border-zinc-700',
              color + '/10'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className={twMerge('p-3 rounded-full', color, 'bg-opacity-80')}> <Icon size={28} /> </div>
            <div>
              <div className="text-lg font-bold">{value}</div>
              <div className="text-sm text-zinc-400">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-700 mb-10">
        <div className="font-semibold mb-4 text-zinc-200">Proyección Mensual</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-700">
        <div className="font-semibold mb-4 text-zinc-200">Termómetro</div>
        <div className="w-full h-6 bg-zinc-700 rounded-full overflow-hidden">
          <motion.div
            className="h-6 bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1.2 }}
          />
        </div>
        <div className="text-right text-xs text-zinc-400 mt-1">70% Vitalidad</div>
      </div>
    </div>
  );
}
