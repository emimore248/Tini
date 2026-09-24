import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  activeSuggestions?: string[];
}

export function InputArea({
  onSendMessage,
  isLoading,
  activeSuggestions = [],
}: InputAreaProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultSuggestions = [
    '¿Qué récords marcó la gira Violetta Live 2015?',
    '¿Cuál es la temática principal del álbum Un Mechón de Pelo?',
    '¿Qué logros tuvo con Coldplay en Saturday Night Live?',
    '¿Quiénes son sus padres y qué formación artística tuvo?',
  ];

  const suggestions = activeSuggestions.length > 0 ? activeSuggestions : defaultSuggestions;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 md:px-8 md:pb-6 bg-white/80 backdrop-blur-md border-t border-pink-200/70 shrink-0">
      <div className="max-w-3xl mx-auto space-y-2.5">
        {/* Chips de sugerencias rápidas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-purple-700 font-semibold shrink-0 flex items-center gap-1 text-[11px] mr-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Sugerencias:
          </span>
          {suggestions.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => onSendMessage(item)}
              className="px-3 py-1 rounded-full bg-white hover:bg-pink-50 border border-pink-200/80 hover:border-pink-400 text-slate-700 hover:text-pink-700 text-[11px] whitespace-nowrap transition-all disabled:opacity-50 shadow-2xs"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Caja de entrada de texto */}
        <div className="relative flex items-end gap-2 bg-white border border-pink-200/90 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200/60 rounded-2xl p-2 transition-all shadow-xs">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Realice una consulta basada en la documentación oficial de TINI..."
            disabled={isLoading}
            className="w-full bg-transparent resize-none px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-36 leading-relaxed"
          />

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 transition-all shrink-0 shadow-md shadow-pink-200/60 disabled:shadow-none disabled:cursor-not-allowed"
            title="Enviar consulta (Enter)"
            aria-label="Enviar consulta"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
          <span>Respuestas restringidas de forma estricta a la base documental cargada.</span>
          <span className="hidden sm:inline">Presione Enter para enviar · Shift+Enter para salto</span>
        </div>
      </div>
    </div>
  );
}
