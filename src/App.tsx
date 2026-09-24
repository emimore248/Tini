import { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ChatThread } from './components/ChatThread.tsx';
import { InputArea } from './components/InputArea.tsx';
import { RulesModal } from './components/RulesModal.tsx';
import { Message, Topic, SystemStatus } from './types.ts';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Carga inicial de estado del sistema y temas autorizados
  useEffect(() => {
    async function initData() {
      try {
        const [healthRes, topicsRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/topics'),
        ]);

        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setSystemStatus(healthData);
        }

        if (topicsRes.ok) {
          const topicsData = await topicsRes.json();
          setTopics(topicsData.topics || []);
          if (topicsData.topics && topicsData.topics.length > 0) {
            setSelectedTopic(topicsData.topics[0]);
          }
        }
      } catch (err) {
        console.error('Error al inicializar datos:', err);
      }
    }

    initData();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Historial para mantener contexto de la conversación
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload,
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: data.grounded,
        sourceSection: data.sourceSection,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error en la comunicación con el servidor:', err);
      const errorMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50/90 via-purple-50/60 to-sky-50/70 font-sans text-slate-800 relative selection:bg-pink-500 selection:text-white">
      {/* Luces ambientales sutiles estilo show pop TINI (claras y vibrantes) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300/35 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-sky-200/45 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Barra lateral de navegación temática y pruebas */}
      <Sidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onSelectTopic={(topic) => setSelectedTopic(topic)}
        onSelectQuestion={(q) => {
          setIsSidebarOpen(false);
          handleSendMessage(q);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Área central principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden z-10">
        <Header
          status={systemStatus}
          onOpenRules={() => setIsRulesModalOpen(true)}
          onClearChat={handleClearChat}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          messageCount={messages.length}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <ChatThread
            messages={messages}
            isLoading={isLoading}
            onSelectSuggestion={(q) => handleSendMessage(q)}
          />

          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeSuggestions={selectedTopic?.sampleQuestions}
          />
        </main>
      </div>

      {/* Modal de reglas operativas */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
