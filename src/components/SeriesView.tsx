import React from 'react';
import { Sermon } from '../types';
import { THEMATIC_SERIES } from '../data/initialSermons';
import { Bookmark, BookOpen, ArrowRight, Library } from 'lucide-react';

interface SeriesViewProps {
  sermons: Sermon[];
  onSelectSeries: (themeKeyword: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ sermons, onSelectSeries }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2dfd7] pb-4">
        <div>
          <h2 className="font-newsreader text-2xl sm:text-3xl font-bold text-[#1a1c1b] flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-[#b5891a]" />
            Series Expositivas y Temas Doctrinales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manuscritos organizados por series temáticas, ciclos de enseñanza y estudios sistemáticos.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-[#f4f4f2] px-3 py-1.5 rounded-lg border border-[#e2dfd7] self-start sm:self-auto">
          {THEMATIC_SERIES.length} series registradas
        </div>
      </div>

      {/* Grid of Series */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {THEMATIC_SERIES.map((serie) => {
          // Count matched sermons
          const matchingCount = sermons.filter(s =>
            serie.tags.some(t => s.title.toLowerCase().includes(t.toLowerCase()) || s.theme.toLowerCase().includes(t.toLowerCase()) || s.scripture.toLowerCase().includes(t.toLowerCase()) || s.tags.some(st => st.toLowerCase().includes(t.toLowerCase())))
          ).length;

          return (
            <div
              key={serie.id}
              className="bg-white rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className={`h-3 bg-gradient-to-r ${serie.bannerTone}`} />
              <div className="p-6 flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9c6f09] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Serie Expositiva
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {matchingCount} {matchingCount === 1 ? 'manuscrito' : 'manuscritos'}
                  </span>
                </div>

                <h3 className="font-newsreader text-xl font-bold text-[#1a1c1b] group-hover:text-[#b5891a] transition-colors">
                  {serie.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {serie.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {serie.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded bg-[#f4f4f2] text-slate-700 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#fbfbf9] border-t border-[#f0eee9] flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo canónico verificado
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSeries(serie.tags[0] || serie.title)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#b5891a] hover:text-[#9c6f09] transition-colors"
                >
                  <span>Explorar prédicas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
