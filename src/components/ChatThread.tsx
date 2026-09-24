import { useRef, useEffect, useState } from 'react';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Award,
  Music
} from 'lucide-react';
import { Message } from '../types.ts';

interface ChatThreadProps {
  messages: Message[];
  isLoading: boolean;
  onSelectSuggestion: (text: string) => void;
}

export function ChatThread({
  messages,
  isLoading,
  onSelectSuggestion,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const welcomeCards = [
    {
      icon: TrendingUp,
      color: 'from-pink-100 to-rose-100 text-pink-600 border-pink-200',
      title: 'Hito Billboard Hot 100',
      description: 'Primera mujer argentina en ingresar al Hot 100 con Coldplay ("We Pray").',
      query: '¿Qué hito marcó la colaboración "We Pray" con Coldplay en el Billboard Hot 100?',
    },
    {
      icon: Music,
      color: 'from-purple-100 to-fuchsia-100 text-purple-600 border-purple-200',
      title: 'Era Un Mechón de Pelo',
      description: 'Giro al pop alternativo, salud mental y la trilogía Pa, Posta y Buenos Aires.',
      query: '¿Por qué Tini engavetó su álbum urbano para grabar Un Mechón de Pelo y qué temas trata?',
    },
    {
      icon: Award,
      color: 'from-sky-100 to-blue-100 text-sky-600 border-sky-200',
      title: 'Récords de Giras y Cifras',
      description: '9 Luna Parks, 6 Hipódromos, Violetta Live 2015 y 100.000 personas en Posadas.',
      query: '¿Cuáles han sido los récords de asistencia y recaudación de sus giras (Luna Park, Violetta, Posadas)?',
    },
    {
      icon: FileText,
      color: 'from-pink-100 to-purple-100 text-fuchsia-600 border-pink-200',
      title: 'Alianza con Emilia Mernes',
      description: 'Rendimiento comercial del sencillo "La Original" y desmentida de rivalidades.',
      query: '¿Qué resultados comerciales y certificaciones obtuvo el tema "La Original" con Emilia Mernes?',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
      {messages.length === 0 ? (
        <div className="max-w-3xl mx-auto py-8">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100 border border-pink-200 text-pink-600 mb-2 shadow-sm shadow-pink-100 animate-pulse">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Asistente Virtual TINI
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Sistema de consultas de alta precisión documental. Respuestas formuladas de manera exclusiva a partir del dossier oficial de TINI (1997–2027), sin inferencias externas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {welcomeCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion(card.query)}
                  className="p-4 rounded-2xl bg-white/90 hover:bg-white border border-pink-200/80 hover:border-pink-300 text-left transition-all group flex flex-col justify-between shadow-xs hover:shadow-md hover:shadow-pink-100/60"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} border transition-transform group-hover:scale-105 shadow-2xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-pink-100 flex items-center text-[11px] font-semibold text-pink-600 group-hover:text-pink-700">
                    <span>Consultar esto</span>
                    <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50/60 to-sky-50 border border-pink-200 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
            <Sparkles className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-pink-700">Cláusula de Rigor Garantizada</p>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                Si consulta un dato no especificado en el texto, el asistente responderá con la fórmula reglamentaria: <span className="text-pink-700 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-pink-200">&ldquo;Lo siento, pero no dispongo de esa información en la base de datos proporcionada.&rdquo;</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isStrictNegative = msg.content.includes(
              'Lo siento, pero no dispongo de esa información en la base de datos proporcionada.'
            );

            return (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 md:p-5 transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-md shadow-pink-200/50 border border-pink-400/20'
                      : isStrictNegative
                      ? 'bg-amber-50/90 border border-amber-200/90 text-amber-950 shadow-xs'
                      : 'bg-white border border-pink-100/90 text-slate-800 shadow-sm shadow-purple-50/50'
                  }`}
                >
                  {/* Etiqueta superior del asistente */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-pink-100/80 text-[11px]">
                      {isStrictNegative ? (
                        <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Información no contenida en la base de datos
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-pink-600 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                          Verificado contra documentación oficial TINI
                        </span>
                      )}

                      <span className="text-slate-400 text-[10px]">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Cuerpo del mensaje */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.content}
                  </div>

                  {/* Barra de herramientas para mensajes del asistente */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-pink-100/80 text-xs text-slate-500">
                      <div className="text-[11px] text-purple-700/70 font-medium">
                        {isStrictNegative ? 'Regla estricta aplicada' : 'Fuente explícita'}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title="Copiar texto"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-pink-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title={speakingId === msg.id ? 'Detener lectura' : 'Escuchar respuesta'}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-pink-600" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0 mt-1 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin text-pink-600" />
              </div>
              <div className="bg-white border border-pink-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                </div>
                <span className="text-xs text-purple-700 font-medium">
                  Validando contra el documento oficial de TINI...
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}
    </div>
  );
}
