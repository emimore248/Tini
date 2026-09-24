import { Sparkles, Lock, RotateCcw, BookOpen, Menu } from 'lucide-react';
import { SystemStatus } from '../types.ts';

interface HeaderProps {
  status: SystemStatus | null;
  onOpenRules: () => void;
  onClearChat: () => void;
  onToggleSidebar: () => void;
  messageCount: number;
}

export function Header({
  status,
  onOpenRules,
  onClearChat,
  onToggleSidebar,
  messageCount,
}: HeaderProps) {
  return (
    <header className="h-16 px-4 md:px-6 bg-white/85 backdrop-blur-md border-b border-pink-200/70 flex items-center justify-between shrink-0 z-20 shadow-xs shadow-pink-100/50">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-100/60 rounded-xl transition-colors"
          aria-label="Abrir panel lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-pink-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Asistente Virtual Especializado
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold text-pink-700 bg-pink-100/80 border border-pink-200 rounded-md shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-sm shadow-pink-400" />
                Modo Estricto TINI
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-purple-700 font-medium">Dossier Integral (1997–2027)</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3 text-pink-500" />
                Base Privada Segura
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-xl transition-all shadow-xs"
          title="Ver reglas operativas estrictas"
        >
          <BookOpen className="w-3.5 h-3.5 text-pink-500" />
          <span className="hidden sm:inline">Reglas Operativas</span>
        </button>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-pink-600 bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-200 rounded-xl transition-colors shadow-xs"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Consulta</span>
          </button>
        )}
      </div>
    </header>
  );
}
