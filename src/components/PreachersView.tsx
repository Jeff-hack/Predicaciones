import React from 'react';
import { Sermon } from '../types';
import { PREACHERS } from '../data/initialSermons';
import { UserCheck, BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface PreachersViewProps {
  sermons: Sermon[];
  onOpenPdf: (sermon: Sermon) => void;
}

export const PreachersView: React.FC<PreachersViewProps> = ({ sermons, onOpenPdf }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2dfd7] pb-4">
        <div>
          <h2 className="font-newsreader text-2xl sm:text-3xl font-bold text-[#1a1c1b] flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-[#b5891a]" />
            Directorio de Predicadores y Expositores
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Registro de maestros y pastores cuyos manuscritos y notas se custodian en este archivo.
          </p>
        </div>
      </div>

      {/* Preachers Cards */}
      <div className="grid grid-cols-1 gap-6">
        {PREACHERS.map((preacher, idx) => {
          const preacherSermons = sermons.filter(s =>
            s.preacher.toLowerCase().includes(preacher.name.toLowerCase())
          );

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#e2dfd7] shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-2xl bg-[#0f1c2c] text-white flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
                <span className="font-newsreader text-2xl font-bold text-amber-300">
                  {preacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
              </div>

              {/* Information */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-newsreader text-2xl font-bold text-[#1a1c1b]">
                      {preacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#b5891a] mt-0.5">
                      {preacher.role} • <span className="text-slate-500">{preacher.church}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-[#f4f4f2] text-slate-700 px-3 py-1 rounded-full border border-[#e2dfd7] self-start">
                    {preacherSermons.length} {preacherSermons.length === 1 ? 'manuscrito custodiado' : 'manuscritos custodiados'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans-ui">
                  {preacher.bio}
                </p>

                {/* Sermons list */}
                <div className="pt-4 border-t border-[#f0eee9]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Manuscritos en Archivo
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {preacherSermons.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => onOpenPdf(s)}
                        className="p-3 rounded-lg bg-[#fbfbf9] hover:bg-[#f4f4f2] border border-[#e2dfd7] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-newsreader text-sm font-semibold text-slate-900 group-hover:text-[#b5891a] truncate">
                            {s.title}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <BookOpen className="w-3 h-3 text-[#b5891a]" />
                            <span>{s.scripture}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{s.displayDate}</span>
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b5891a] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
