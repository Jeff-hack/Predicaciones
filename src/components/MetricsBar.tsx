import React from 'react';
import { Sermon } from '../types';
import { BookOpen, Calendar, Scroll, Layers } from 'lucide-react';

interface MetricsBarProps {
  sermons: Sermon[];
  onSelectRecentSermon: (sermon: Sermon) => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ sermons, onSelectRecentSermon }) => {
  const totalCount = sermons.length;
  const year2026Count = sermons.filter(s => s.date.startsWith('2026')).length;
  
  // Find most recent sermon
  const sortedByDate = [...sermons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestSermon = sortedByDate[0] || null;

  // Calculate unique themes and categories
  const uniqueThemes = new Set(sermons.map(s => s.theme));
  const uniqueCategories = new Set(sermons.map(s => s.category));

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Card 1: Acervo Digital */}
      <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d0a531]" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans-ui">
            Acervo Digital
          </span>
          <BookOpen className="w-5 h-5 text-[#545e76]" />
        </div>
        <div className="mt-4 flex flex-col">
          <span className="font-newsreader text-4xl text-[#1a1c1b] font-semibold tracking-tight">
            {totalCount}
          </span>
          <span className="text-xs text-slate-600 mt-0.5">
            Documentos en archivo PDF
          </span>
        </div>
      </div>

      {/* Card 2: Año Litúrgico Actual */}
      <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f1c2c]" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans-ui">
            Año Litúrgico Actual
          </span>
          <Calendar className="w-5 h-5 text-[#545e76]" />
        </div>
        <div className="mt-4 flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-newsreader text-4xl text-[#1a1c1b] font-semibold tracking-tight">
              {year2026Count}
            </span>
            <span className="text-sm font-bold text-[#d0a531]">2026</span>
          </div>
          <span className="text-xs text-slate-600 mt-0.5">
            Predicaciones impartidas
          </span>
        </div>
      </div>

      {/* Card 3: Última Predicación */}
      <div 
        onClick={() => latestSermon && onSelectRecentSermon(latestSermon)}
        className="relative overflow-hidden bg-white p-5 rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow transition-shadow flex flex-col justify-between cursor-pointer group"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b5891a]" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans-ui">
            Última Predicación
          </span>
          <Scroll className="w-5 h-5 text-[#b5891a] group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-4 flex flex-col">
          <span className="font-newsreader text-lg sm:text-xl text-[#1a1c1b] font-semibold truncate group-hover:text-[#b5891a] transition-colors" title={latestSermon?.title}>
            {latestSermon ? latestSermon.title : 'Sin registros'}
          </span>
          <span className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {latestSermon ? `${latestSermon.displayDate} • ${latestSermon.scripture}` : '—'}
          </span>
        </div>
      </div>

      {/* Card 4: Temas & Categorías */}
      <div className="relative overflow-hidden bg-white p-5 rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#545e76]" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans-ui">
            Temas & Categorías
          </span>
          <Layers className="w-5 h-5 text-[#545e76]" />
        </div>
        <div className="mt-4 flex flex-col">
          <div className="flex items-baseline gap-3">
            <span className="font-newsreader text-4xl text-[#1a1c1b] font-semibold tracking-tight">
              {Math.max(uniqueThemes.size, 8)}
            </span>
            <span className="text-xs text-slate-600">Temas</span>
            <span className="font-newsreader text-4xl text-[#1a1c1b] font-semibold tracking-tight ml-2">
              {Math.max(uniqueCategories.size, 3)}
            </span>
            <span className="text-xs text-slate-600">Categorías</span>
          </div>
          <span className="text-xs text-slate-600 mt-0.5">
            Índice temático clasificado
          </span>
        </div>
      </div>
    </section>
  );
};
