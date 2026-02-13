/**
 * CHATBOT CON ANÁLISIS DE SENTIMIENTOS
 * Interfaz para comunicación con análisis emocional en tiempo real
 * 
 * "Cada palabra revela el estado del corazón"
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSentimentAnalysis, SentimentType } from '../hooks/useSentimentAnalysis';
import { useI18n } from '../i18n/I18nContext';

interface ChatbotProps {
  userId?: string;
  userName?: string;
  userRole?: string;
}

export const SentimentChatbot: React.FC<ChatbotProps> = ({
  userId = 'user-1',
  userName = 'Usuario',
  userRole = 'worker',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { messages, analyzer, analyzeMessage, getTeamMoodStats } = useSentimentAnalysis();
  const { t, language } = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando lleguen nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    analyzeMessage(inputText, userId, userName, userRole);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const teamMood = getTeamMoodStats();

  const getSentimentColor = (type: SentimentType) => {
    return analyzer.getColor(type);
  };

  const getSentimentEmoji = (type: SentimentType) => {
    return analyzer.getEmoji(type);
  };

  return (
    <div className="sentiment-chatbot">
      {/* Botón flotante */}
      <button
        className="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Asistente con Análisis de Sentimientos"
      >
        <span className="chatbot-icon">💬</span>
        {messages.length > 0 && (
          <span className="message-badge">{messages.length}</span>
        )}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <h3>Sistema de Percepción</h3>
              <p className="active-listening">🎧 Escucha Activa</p>
              <p className="team-mood">
                Estado del Equipo:{' '}
                <span style={{ color: getSentimentColor(teamMood.overall) }}>
                  {getSentimentEmoji(teamMood.overall)} {teamMood.overall}
                </span>
              </p>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Estadísticas del equipo */}
          {teamMood.totalMessages > 0 && (
            <div className="team-mood-stats">
              <div className="stat">
                <span className="emoji">😊</span>
                <span className="count">{teamMood.positiveCount}</span>
              </div>
              <div className="stat">
                <span className="emoji">😐</span>
                <span className="count">{teamMood.neutralCount}</span>
              </div>
              <div className="stat">
                <span className="emoji">😞</span>
                <span className="count">{teamMood.negativeCount}</span>
              </div>
            </div>
          )}

          {/* Lista de mensajes */}
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No hay mensajes aún.</p>
                <p>Comparte cómo te sientes...</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.userId === userId ? 'own' : 'other'}`}
                >
                  <div className="message-header">
                    <span className="user-name">{msg.userName}</span>
                    <span className="timestamp">
                      {msg.timestamp.toLocaleTimeString(language, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="message-body">{msg.message}</div>
                  {msg.motivationalMessage && (
                    <div className="message-motivation">
                      🇻🇳 {msg.motivationalMessage}
                    </div>
                  )}
                  <div
                    className="sentiment-indicator"
                    style={{ backgroundColor: getSentimentColor(msg.sentiment.type) }}
                  >
                    <span className="sentiment-emoji">
                      {getSentimentEmoji(msg.sentiment.type)}
                    </span>
                    <span className="sentiment-score">
                      {msg.sentiment.score > 0 ? '+' : ''}
                      {msg.sentiment.score}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === 'es'
                  ? '¿Cómo te sientes hoy?'
                  : language === 'vi'
                  ? 'Bạn cảm thấy thế nào hôm nay?'
                  : 'How do you feel today?'
              }
              rows={2}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
              {language === 'es' ? 'Enviar' : language === 'vi' ? 'Gửi' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
