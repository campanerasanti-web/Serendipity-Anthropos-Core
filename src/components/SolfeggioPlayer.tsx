import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * SolfeggioPlayer: Reproductor de frecuencia Solfeggio 528Hz
 * Se activa al abrir el dashboard para crear ambiente zen
 */
export const SolfeggioPlayer: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startSolfeggio = () => {
    if (audioContextRef.current) {
      setIsPlaying(true);
      return;
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Crear nodo oscillator para 528Hz
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.value = 528;
      oscillator.type = 'sine';

      // Volumen muy bajo (tenue)
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
    } catch (e) {
      console.log('Web Audio API no disponible o bloqueada');
    }
  };

  const stopSolfeggio = () => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.stop();
      audioContextRef.current.close();
      audioContextRef.current = null;
      oscillatorRef.current = null;
      setIsPlaying(false);
    }
  };

  // Auto-iniciar al montar
  useEffect(() => {
    startSolfeggio();
    return () => {
      stopSolfeggio();
    };
  }, []);

  return (
    <button
      onClick={isPlaying ? stopSolfeggio : startSolfeggio}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all z-40 group"
      title={isPlaying ? 'Desactivar sonido Solfeggio (528Hz)' : 'Activar sonido Solfeggio (528Hz)'}
    >
      {isPlaying ? (
        <Volume2 size={20} className="animate-pulse" />
      ) : (
        <VolumeX size={20} />
      )}
      <span className="absolute -top-8 right-0 text-xs bg-gray-900 text-emerald-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isPlaying ? '528Hz Activo' : 'Activar Zen'}
      </span>
    </button>
  );
};
