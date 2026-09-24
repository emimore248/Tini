import { Sparkles, Lock, FileCheck2, AlertTriangle, X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl p-6 shadow-2xl shadow-purple-100/60 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 border border-pink-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Reglas Operativas del Asistente
              </h2>
              <p className="text-xs text-slate-500">Directivas estrictas del sistema de consulta TINI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pink-50/40 border border-pink-100/90">
            <FileCheck2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">1. Exclusividad Documental</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Responde únicamente utilizando la información explícita presente en los documentos subidos sobre Martina &ldquo;TINI&rdquo; Stoessel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pink-50/40 border border-pink-100/90">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">2. Respuesta Estricta ante Ausencia de Datos</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Si la respuesta no se encuentra en el documento, responderá exactamente:
              </p>
              <p className="text-xs font-mono bg-white px-2.5 py-1.5 rounded-lg text-pink-700 mt-1.5 border border-pink-200 shadow-2xs">
                &ldquo;Lo siento, pero no dispongo de esa información en la base de datos proporcionada.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pink-50/40 border border-pink-100/90">
            <Sparkles className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">3. Sin Suposiciones ni Datos Externos</p>
              <p className="text-xs text-slate-600 mt-0.5">
                No utiliza conocimientos externos al documento ni realiza conjeturas fuera del texto brindado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pink-50/40 border border-pink-100/90">
            <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">4. Protección de Base de Datos</p>
              <p className="text-xs text-slate-600 mt-0.5">
                El usuario no tiene acceso directo para descargar ni visualizar el archivo fuente de la base de datos.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl transition-all shadow-md shadow-pink-200"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
