/**
 * SISTEMA DE PERCEPCIÓN - Sentiment Analysis
 * Detecta el estado anímico del equipo a través del texto
 * 
 * "Cada mensaje revela el clima emocional del alma"
 */

import { useState, useEffect } from 'react';

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface SentimentScore {
  score: number;        // -5 a +5 (negativo a positivo)
  comparative: number;  // Score normalizado por palabra
  type: SentimentType;
  tokens: string[];     // Palabras analizadas
  positiveWords: string[];
  negativeWords: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  sentiment: SentimentScore;
  timestamp: Date;
  context?: string[];
  motivationalMessage?: string;
}

/**
 * Simple sentiment analysis (sin dependencias externas)
 * Basado en palabras clave en ES/VI/EN
 */
export class SimpleSentimentAnalyzer {
  private positiveWordsES = [
    'bien', 'bueno', 'excelente', 'perfecto', 'genial', 'feliz', 'contento',
    'alegre', 'gracias', 'éxito', 'logro', 'avance', 'mejor', 'fantástico',
    'amor', 'paz', 'luz', 'esperanza', 'bendición', 'gratitud',
  ];

  private negativeWordsES = [
    'mal', 'malo', 'terrible', 'horrible', 'triste', 'enojado', 'frustrado',
    'problema', 'error', 'fallo', 'difícil', 'imposible', 'preocupado',
    'miedo', 'ansiedad', 'estrés', 'cansado', 'agotado', 'injusticia',
  ];

  private positiveWordsVI = [
    'tốt', 'tuyệt', 'hoàn hảo', 'vui', 'hạnh phúc', 'cảm ơn', 'thành công',
    'tiến bộ', 'yêu', 'hòa bình', 'ánh sáng', 'hy vọng', 'phước lành',
  ];

  private negativeWordsVI = [
    'xấu', 'tồi tệ', 'buồn', 'giận', 'thất vọng', 'vấn đề', 'lỗi',
    'khó', 'lo lắng', 'căng thẳng', 'mệt', 'bất công',
  ];

  private positiveWordsEN = [
    'good', 'great', 'excellent', 'perfect', 'amazing', 'happy', 'glad',
    'joyful', 'thanks', 'success', 'achievement', 'progress', 'better',
    'love', 'peace', 'light', 'hope', 'blessing', 'gratitude',
  ];

  private negativeWordsEN = [
    'bad', 'terrible', 'horrible', 'sad', 'angry', 'frustrated', 'problem',
    'error', 'failure', 'difficult', 'impossible', 'worried', 'fear',
    'anxiety', 'stress', 'tired', 'exhausted', 'injustice',
  ];

  analyze(text: string): SentimentScore {
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\sáéíóúñ]/g, '') // Mantener acentos
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const allPositive = [
      ...this.positiveWordsES,
      ...this.positiveWordsVI,
      ...this.positiveWordsEN,
    ];
    const allNegative = [
      ...this.negativeWordsES,
      ...this.negativeWordsVI,
      ...this.negativeWordsEN,
    ];

    const positiveWords = tokens.filter((t) => allPositive.includes(t));
    const negativeWords = tokens.filter((t) => allNegative.includes(t));

    const score = positiveWords.length - negativeWords.length;
    const comparative = tokens.length > 0 ? score / tokens.length : 0;

    let type: SentimentType = 'neutral';
    if (score > 0) type = 'positive';
    else if (score < 0) type = 'negative';

    return {
      score,
      comparative,
      type,
      tokens,
      positiveWords,
      negativeWords,
    };
  }

  getEmoji(type: SentimentType): string {
    switch (type) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  }

  getColor(type: SentimentType): string {
    switch (type) {
      case 'positive':
        return '#4ade80'; // green-400
      case 'negative':
        return '#f87171'; // red-400
      default:
        return '#94a3b8'; // slate-400
    }
  }

  getVietnameseMotivation(type: SentimentType): string {
    switch (type) {
      case 'positive':
        return 'Tuyet voi! Nang luong tich cuc dang lan toa. Hay giu nhip nay.';
      case 'negative':
        return 'Moi kho khan la mot bai hoc. Minh dang o day va se vuot qua cung nhau.';
      default:
        return 'Giua on ao, hay nho hít thở va giu tam binh an.';
    }
  }
}

/**
 * Hook para análisis de sentimientos con historial
 */
export const useSentimentAnalysis = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Recuperar historial de localStorage
    const saved = localStorage.getItem('serendipity-chat-messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [analyzer] = useState(new SimpleSentimentAnalyzer());

  // Persistir mensajes en localStorage
  useEffect(() => {
    localStorage.setItem('serendipity-chat-messages', JSON.stringify(messages));
  }, [messages]);

  /**
   * Analiza un mensaje y lo añade al historial
   */
  const analyzeMessage = (
    text: string,
    userId: string,
    userName: string,
    userRole: string,
    context?: string[]
  ): ChatMessage => {
    const sentiment = analyzer.analyze(text);
    const motivationalMessage = analyzer.getVietnameseMotivation(sentiment.type);
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      userRole,
      message: text,
      sentiment,
      timestamp: new Date(),
      context,
      motivationalMessage,
    };

    setMessages((prev) => [...prev, message]);
    
    console.log(`💬 Mensaje analizado: ${userName} → ${sentiment.type} (${sentiment.score})`);

    return message;
  };

  /**
   * Obtiene estadísticas de sentimiento del equipo
   */
  const getTeamMoodStats = () => {
    if (messages.length === 0) {
      return {
        overall: 'neutral' as SentimentType,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        totalMessages: 0,
        averageScore: 0,
      };
    }

    const positiveCount = messages.filter((m) => m.sentiment.type === 'positive').length;
    const neutralCount = messages.filter((m) => m.sentiment.type === 'neutral').length;
    const negativeCount = messages.filter((m) => m.sentiment.type === 'negative').length;
    const totalMessages = messages.length;
    const averageScore =
      messages.reduce((sum, m) => sum + m.sentiment.score, 0) / totalMessages;

    let overall: SentimentType = 'neutral';
    if (averageScore > 0.5) overall = 'positive';
    else if (averageScore < -0.5) overall = 'negative';

    return {
      overall,
      positiveCount,
      neutralCount,
      negativeCount,
      totalMessages,
      averageScore,
    };
  };

  /**
   * Obtiene mensajes de un usuario específico
   */
  const getUserMessages = (userId: string): ChatMessage[] => {
    return messages.filter((m) => m.userId === userId);
  };

  /**
   * Limpia mensajes antiguos (más de 7 días)
   */
  const cleanOldMessages = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    setMessages((prev) => prev.filter((m) => m.timestamp > sevenDaysAgo));
  };

  /**
   * Limpia todos los mensajes
   */
  const clearAllMessages = () => {
    setMessages([]);
    localStorage.removeItem('serendipity-chat-messages');
  };

  return {
    messages,
    analyzer,
    analyzeMessage,
    getTeamMoodStats,
    getUserMessages,
    cleanOldMessages,
    clearAllMessages,
  };
};

/**
 * Hook para obtener solo estadísticas (sin lógica de análisis)
 */
export const useTeamMood = () => {
  const { getTeamMoodStats, messages } = useSentimentAnalysis();
  const [stats, setStats] = useState(getTeamMoodStats());

  useEffect(() => {
    setStats(getTeamMoodStats());
  }, [messages]);

  return stats;
};
