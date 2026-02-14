import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mobileApiClient } from '../services/apiClient';
import { useAgentStore } from '../store/dashboardStore';

const AGENTS = [
  {
    id: 'ops_gardener',
    name: 'OpsGardener',
    seed: '🌾',
    persona: 'Jardinera de los ritmos',
  },
  {
    id: 'security_gardener',
    name: 'SecurityGardener',
    seed: '🥜',
    persona: 'Con ojos de guardian',
  },
  {
    id: 'anthropos_core',
    name: 'AnthroposCore',
    seed: '🌻',
    persona: 'Voz de unidad',
  },
  {
    id: 'self_gardener',
    name: 'SelfGardener',
    seed: '🌺',
    persona: 'Presencia suave',
  },
];

export default function AgentsScreen() {
  const insets = useSafeAreaInsets();
  const { activeAgent, messages, setActiveAgent, addMessage } = useAgentStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSelectAgent = (agentId: string) => {
    setActiveAgent(agentId);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activeAgent) return;

    addMessage('user', input);
    setInput('');
    setSending(true);

    try {
      const response = await mobileApiClient.sendAgentMessage(activeAgent, input);
      const agentReply =
        response?.nextStep?.message || 'Gracias por confiar en mí. Sigo escuchando.';
      addMessage('agent', agentReply);
    } catch (error) {
      addMessage('agent', 'Estoy aquí contigo. Hubo un error, pero sigo escuchando.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {!activeAgent ? (
        <ScrollView style={styles.agentList}>
          <Text style={styles.header}>Elige un agente</Text>
          {AGENTS.map((agent) => (
            <TouchableOpacity
              key={agent.id}
              style={styles.agentButton}
              onPress={() => handleSelectAgent(agent.id)}
            >
              <Text style={styles.agentSeed}>{agent.seed}</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentPersona}>{agent.persona}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveAgent(null)}>
              <Text style={styles.backButton}>← Atrás</Text>
            </TouchableOpacity>
            <Text style={styles.chatTitle}>
              {AGENTS.find((a) => a.id === activeAgent)?.name}
            </Text>
          </View>

          <ScrollView style={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.message,
                  msg.role === 'user' ? styles.userMessage : styles.agentMessage,
                ]}
              >
                <Text
                  style={
                    msg.role === 'user' ? styles.userMessageText : styles.agentMessageText
                  }
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#64748b"
              value={input}
              onChangeText={setInput}
              editable={!sending}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.sendButtonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  agentList: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 16,
  },
  agentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10b98133',
  },
  agentSeed: {
    fontSize: 32,
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  agentPersona: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#064e3b',
  },
  backButton: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  agentMessage: {
    alignItems: 'flex-start',
  },
  userMessageText: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
    fontSize: 14,
  },
  agentMessageText: {
    backgroundColor: '#064e3b',
    color: '#10b981',
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 14,
  },
});
