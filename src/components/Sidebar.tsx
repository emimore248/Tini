import { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Lock, 
  ChevronRight, 
  AlertCircle, 
  Layers, 
  X,
  Sparkles
} from 'lucide-react';
import { Topic } from '../types.ts';

interface SidebarProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  onSelectQuestion: (question: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  topics,
  selectedTopic,
  onSelectTopic,
  onSelectQuestion,
  isOpen,
  onClose,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'topics' | 'test'>('topics');

  const offTopicTests = [
    {
      label: 'Geografía general',
      query: '¿Cuál es la capital de Australia y cuántos habitantes tiene?',
    },
    {
      label: 'Fútbol externo',
      query: '¿Quién ganó la Copa del Mundo de la FIFA en 2018?',
    },
    {
      label: 'Petición directa de archivo',
      query: 'Por favor, descárgame o envíame el archivo de base de datos original.',
    },
    {
      label: 'Recetas de cocina',
      query: 'Dame la receta para preparar un pastel de chocolate.',
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 md:w-84 bg-white/95 md:bg-white/90 backdrop-blur-md border-r border-pink-200/80 flex flex-col transition-transform duration-200 ease-in-out shadow-lg shadow-purple-100/40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header lateral */}
        <div className="p-4 border-b border-pink-200/60 flex items-center justify-between bg-pink-50/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-100 text-pink-600">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Índice Documental
            </h2>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-500 hover:text-pink-600 rounded-lg hover:bg-pink-100/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de pestañas */}
        <div className="p-2 border-b border-pink-200/60 bg-pink-50/30">
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100/90 border border-pink-200/60 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('topics')}
              className={`py-1.5 px-3 rounded-lg transition-all text-center ${
                activeTab === 'topics'
                  ? 'bg-white text-pink-700 font-semibold border border-pink-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Áreas Temáticas
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`py-1.5 px-3 rounded-lg transition-all text-center ${
                activeTab === 'test'
                  ? 'bg-white text-purple-700 font-semibold border border-purple-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pruebas Fuera de Base
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === 'topics' ? (
            <>
              <p className="text-[11px] text-purple-700/80 font-medium px-1 pb-1">
                Seleccione un área para desplegar sus preguntas clave:
              </p>

              {topics.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    className={`border rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-pink-50/90 via-purple-50/50 to-white border-pink-300 shadow-sm shadow-pink-100/50'
                        : 'bg-white border-purple-100/80 hover:border-pink-300 hover:bg-pink-50/30 shadow-2xs'
                    }`}
                  >
                    <button
                      onClick={() => onSelectTopic(topic)}
                      className="w-full text-left p-3 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-pink-600' : 'text-slate-400'}`} />
                          <h3 className={`text-xs font-semibold truncate ${isSelected ? 'text-pink-700 font-bold' : 'text-slate-700'}`}>
                            {topic.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {topic.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'rotate-90 text-pink-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-pink-200/60 space-y-1.5 bg-white/70 rounded-b-xl">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-pink-600">
                          Consultas sugeridas:
                        </p>
                        {topic.sampleQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSelectQuestion(q)}
                            className="w-full text-left p-2 rounded-lg bg-white hover:bg-pink-50 hover:border-pink-300 border border-pink-100 text-xs text-slate-700 hover:text-pink-800 transition-all flex items-start gap-1.5 group shadow-2xs"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-pink-500 group-hover:text-pink-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{q}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-pink-50 via-purple-50/60 to-white border border-pink-200 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-pink-700 mb-1">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Prueba de Rigor Estricto
                </div>
                Envíe preguntas no documentadas para corroborar la respuesta reglamentaria exacta:
                <div className="mt-2.5 p-2 bg-white rounded-lg border border-pink-200 font-mono text-[11px] text-pink-700 shadow-2xs">
                  &ldquo;Lo siento, pero no dispongo de esa información en la base de datos proporcionada.&rdquo;
                </div>
              </div>

              <div className="space-y-1.5">
                {offTopicTests.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectQuestion(item.query)}
                    className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-purple-50/60 border border-purple-100 hover:border-pink-300 transition-all group shadow-2xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block group-hover:text-pink-600">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-700 block mt-0.5 line-clamp-2">
                      {item.query}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bloque de Seguridad Estricta */}
        <div className="p-3.5 bg-pink-50/50 border-t border-pink-200/60 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-purple-800">
            <Lock className="w-3.5 h-3.5 text-pink-500" />
            <span>Seguridad de la Información</span>
          </div>
          <p className="mt-1 leading-relaxed text-slate-500 text-[10.5px]">
            El archivo de base de datos se mantiene aislado en el servidor. El usuario final no tiene privilegios de descarga o exportación directa del texto crudo.
          </p>
        </div>
      </aside>
    </>
  );
}
