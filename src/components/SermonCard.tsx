import React from 'react';
import { Sermon } from '../types';
import { Eye, Download, Edit3, Trash2, User, Calendar, BookOpen } from 'lucide-react';

interface SermonCardProps {
  sermon: Sermon;
  onViewPdf: (sermon: Sermon) => void;
  onDownloadPdf: (sermon: Sermon) => void;
  onEditSermon: (sermon: Sermon) => void;
  onDeleteSermon: (sermon: Sermon) => void;
}

export const SermonCard: React.FC<SermonCardProps> = ({
  sermon,
  onViewPdf,
  onDownloadPdf,
  onEditSermon,
  onDeleteSermon,
}) => {
  // Spine color styling
  const isOldTestament = sermon.testament === 'AT';
  const spineClass = isOldTestament ? 'bg-[#d0a531]' : 'bg-[#0f1c2c]';

  return (
    <article className="bg-white rounded-xl border border-[#e2dfd7] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative group">
      {/* Simulated Book Spine strip */}
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${spineClass}`} />

      {/* Top Header Ribbon */}
      <div className="pt-3 pb-2.5 px-4 pl-6 bg-[#f4f4f2] border-b border-[#e8e8e6] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-[#d0a531] text-[#0f1c2c] text-[10px] font-bold uppercase tracking-wider font-sans-ui shrink-0">
            PDF
          </span>
          <span 
            className="text-xs font-mono text-slate-500 truncate"
            title={sermon.file}
          >
            {sermon.file}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-white text-slate-600 text-[11px] font-medium border border-[#e2dfd7] shrink-0">
          {sermon.category}
        </span>
      </div>

      {/* Main Content Body */}
      <div className="p-4 pl-6 flex-1 flex flex-col gap-2">
        {/* Scripture Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f4f4f2] text-slate-800 text-xs font-semibold tracking-wide border border-[#e2dfd7]/60">
            <BookOpen className="w-3.5 h-3.5 text-[#b5891a]" />
            <span>{sermon.scripture}</span>
          </span>
        </div>

        {/* Sermon Title */}
        <h3
          onClick={() => onViewPdf(sermon)}
          className="font-newsreader text-xl font-bold text-[#1a1c1b] line-clamp-2 hover:text-[#b5891a] cursor-pointer transition-colors pt-0.5"
          title={sermon.title}
        >
          {sermon.title}
        </h3>

        {/* Theme */}
        <p className="text-xs text-[#9c6f09] font-semibold leading-snug">
          Tema: {sermon.theme}
        </p>

        {/* Preacher & Date */}
        <div className="text-xs text-slate-600 flex flex-col gap-1 pt-1">
          <span className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{sermon.preacher}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{sermon.displayDate}</span>
          </span>
        </div>

        {/* Excerpt / Overview */}
        <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed pt-1 font-newsreader">
          "{sermon.description}"
        </p>

        {/* Tags Pills */}
        <div className="flex flex-wrap gap-1 pt-2 mt-auto">
          {sermon.tags.slice(0, 5).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded bg-[#f4f4f2] text-slate-600 font-medium hover:bg-slate-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="p-3 pl-6 bg-white border-t border-[#f0eee9] flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={() => onViewPdf(sermon)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#d0a531] hover:bg-[#b5891a] text-[#0f1c2c] hover:text-white font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95"
          title="Abrir visor de manuscrito PDF"
        >
          <Eye className="w-4 h-4" />
          <span>Ver PDF</span>
        </button>

        <button
          type="button"
          onClick={() => onDownloadPdf(sermon)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#f4f4f2] transition-colors"
          title="Descargar PDF"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onEditSermon(sermon)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#f4f4f2] transition-colors"
          title="Editar predicación"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDeleteSermon(sermon)}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Eliminar predicación"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
