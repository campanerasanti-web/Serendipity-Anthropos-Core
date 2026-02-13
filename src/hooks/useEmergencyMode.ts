/**
 * useEmergencyMode - Detector de Crisis Financiera
 * Monitorea balance contra costos fijos y activa modo emergencia
 * 
 * "Cuando el río se seca, el cauce debe sentir la urgencia"
 */

import { useState, useEffect } from 'react';

export interface EmergencyState {
  isEmergency: boolean;
  severity: 'normal' | 'warning' | 'critical' | 'extreme';
  message: string;
  daysUntilCritical: number;
  unpaidInvoicesCount: number;
  balancePercentage: number; // Porcentaje del balance vs costos fijos mensuales
  shouldPlayPulseSound: boolean;
}

interface FinancialData {
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyPayroll: number;
  profitMargin: number;
}

const CRITICAL_THRESHOLD_DAYS = 30; // 30 días de runway crítico
const WARNING_THRESHOLD_DAYS = 60;  // 60 días aviso
const EXTREME_THRESHOLD_DAYS = 15;  // 15 días extremo

export const useEmergencyMode = (financialData?: FinancialData) => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    isEmergency: false,
    severity: 'normal',
    message: 'Sistema financiero estable',
    daysUntilCritical: 999,
    unpaidInvoicesCount: 0,
    balancePercentage: 100,
    shouldPlayPulseSound: false,
  });

  useEffect(() => {
    if (!financialData) return;

    // Simular balance actual (en producción vendría de la base de datos)
    // Por ahora calculamos basado en profit margin
    const monthlyProfit = financialData.monthlyRevenue - financialData.monthlyExpenses;
    const currentBalance = monthlyProfit * 3; // Asumimos 3 meses de profit guardado
    
    // Costos fijos mensuales (payroll + expenses)
    const monthlyCosts = financialData.monthlyPayroll + financialData.monthlyExpenses;
    
    // Calcular días hasta critical (runway)
    const daysUntilCritical = monthlyCosts > 0 
      ? Math.floor((currentBalance / monthlyCosts) * 30) 
      : 999;
    
    // Porcentaje del balance vs costos mensuales
    const balancePercentage = monthlyCosts > 0 
      ? Math.round((currentBalance / monthlyCosts) * 100)
      : 100;

    // Determinar severity
    let severity: EmergencyState['severity'] = 'normal';
    let message = 'Sistema financiero estable';
    let isEmergency = false;
    let shouldPlayPulseSound = false;

    if (daysUntilCritical <= EXTREME_THRESHOLD_DAYS) {
      severity = 'extreme';
      message = `🚨 CRISIS EXTREMA: ${daysUntilCritical} días de runway`;
      isEmergency = true;
      shouldPlayPulseSound = true;
    } else if (daysUntilCritical <= CRITICAL_THRESHOLD_DAYS) {
      severity = 'critical';
      message = `⚠️ MODO EMERGENCIA: ${daysUntilCritical} días de runway`;
      isEmergency = true;
      shouldPlayPulseSound = true;
    } else if (daysUntilCritical <= WARNING_THRESHOLD_DAYS) {
      severity = 'warning';
      message = `⚡ Alerta: ${daysUntilCritical} días de runway`;
      isEmergency = false;
    } else {
      severity = 'normal';
      message = `✅ Estable: ${daysUntilCritical}+ días de runway`;
    }

    // Simular facturas impagadas (en producción vendría de la API)
    // Por ahora, si estamos en emergencia, asumimos 2-5 facturas pendientes
    const unpaidInvoicesCount = isEmergency ? Math.floor(daysUntilCritical / 10) + 2 : 0;

    setEmergencyState({
      isEmergency,
      severity,
      message,
      daysUntilCritical,
      unpaidInvoicesCount,
      balancePercentage,
      shouldPlayPulseSound,
    });

    // Inyectar clase global al body si es emergencia
    if (isEmergency) {
      document.body.classList.add('is-emergency');
      document.body.setAttribute('data-emergency-severity', severity);
    } else {
      document.body.classList.remove('is-emergency');
      document.body.removeAttribute('data-emergency-severity');
    }

    // Opcional: Reproducir latido auditivo si está habilitado
    if (shouldPlayPulseSound && typeof window !== 'undefined') {
      playEmergencyPulse();
    }

  }, [financialData]);

  // Función para reproducir latido auditivo (opcional)
  const playEmergencyPulse = () => {
    // Web Audio API para generar tono de latido
    try {
      if (!('AudioContext' in window) && !('webkitAudioContext' in window)) {
        return; // Browser no soporta Web Audio
      }

      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Tono bajo (60Hz) tipo latido
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 60; // Frecuencia baja (sub-bass)
      oscillator.type = 'sine';
      
      // Envelope: Attack rápido, decay corto
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3); // Decay
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Segundo latido (efecto double-thump)
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.value = 60;
        osc2.type = 'sine';
        
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }, 200);
      
    } catch (error) {
      console.warn('🔇 Emergency pulse sound failed:', error);
    }
  };

  return emergencyState;
};
