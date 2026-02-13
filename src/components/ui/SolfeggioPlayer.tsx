import React, { useEffect, useRef } from 'react';

export const SolfeggioPlayer: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.value = 528;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillatorRef.current = oscillator;

      return () => {
        oscillator.stop();
        audioContext.close();
      };
    } catch (e) {
      console.log('Web Audio API no disponible');
    }
  }, []);

  return null; // oculto
};
