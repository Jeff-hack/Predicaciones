import React, { useState } from 'react';
import { Sermon } from '../types';
import { FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Printer, X } from 'lucide-react';

interface PdfViewerModalProps {
  sermon: Sermon | null;
  onClose: () => void;
  onDownload: (sermon: Sermon) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  sermon,
  onClose,
  onDownload,
}) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = sermon?.pageCount || 4;

  if (!sermon) return null;

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 70) setZoom(prev => prev - 10);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1c2c]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[92vh] max-h-[960px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        {/* Top Control Bar */}
        <div className="bg-[#0f1c2c] text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-2 border-b border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded bg-amber-400/20 text-amber-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-newsreader text-base sm:text-lg font-semibold truncate leading-tight">
                {sermon.title}
              </span>
              <span className="text-xs font-mono text-slate-400 truncate">
                {sermon.file} {sermon.fileSize ? `(${sermon.fileSize})` : ''}
              </span>
            </div>
          </div>

          {/* Zoom and Page controls */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 70}
              className="p-1 hover:text-amber-300 disabled:opacity-40 transition-colors"
              title="Reducir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-amber-200 font-semibold">{zoom}%</span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 hover:text-amber-300 disabled:opacity-40 transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-slate-500 mx-1">|</span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:text-amber-300 disabled:opacity-40"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 px-1">
              Pág. {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 hover:text-amber-300 disabled:opacity-40"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDownload(sermon)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d0a531] hover:bg-[#b5891a] text-[#0f1c2c] hover:text-white text-xs font-semibold transition-all shadow-sm"
              title="Descargar PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Canvas View */}
        <div className="flex-1 bg-[#f4f4f2] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-white p-6 sm:p-12 md:p-14 rounded-lg shadow-md border border-[#e2dfd7] transition-transform duration-200 flex flex-col gap-6 text-[#1a1c1b]"
          >
            {/* Document Header */}
            <div className="text-center pb-6 border-b border-[#e8e6df] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#9c6f09] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block font-sans-ui">
                {sermon.category.toUpperCase()} EXPOSITIVA
              </span>
              <h1 className="font-newsreader text-2xl sm:text-4xl text-[#1a1c1b] font-bold tracking-tight pt-2">
                {sermon.title}
              </h1>
              <div className="font-newsreader text-lg text-slate-700 italic pt-1">
                📖 {sermon.scripture}
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-center gap-3 pt-2 font-sans-ui">
                <span>Predicador: <strong className="text-slate-700">{sermon.preacher}</strong></span>
                <span>•</span>
                <span>Fecha: <strong className="text-slate-700">{sermon.displayDate}</strong></span>
              </div>
            </div>

            {/* Homiletical Proposition */}
            <div className="p-4 sm:p-5 bg-[#fbfbf9] rounded-lg border-l-4 border-[#d0a531] shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9c6f09] block mb-1 font-sans-ui">
                Proposición Homilética
              </span>
              <p className="font-newsreader text-base sm:text-lg text-slate-800 leading-relaxed italic">
                "{sermon.proposition || sermon.description}"
              </p>
            </div>

            {/* Manuscript Body Outline */}
            <div className="space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base">
              {sermon.outline ? (
                <>
                  <div className="space-y-2">
                    <h3 className="font-sans-ui text-xs font-bold uppercase tracking-wider text-slate-500">
                      Introducción y Contexto Histórico
                    </h3>
                    <p className="font-newsreader text-base sm:text-lg text-slate-800 leading-relaxed">
                      {sermon.outline.intro}
                    </p>
                  </div>

                  {sermon.outline.points.map((point, index) => (
                    <div key={index} className="space-y-2 pt-2">
                      <h2 className="font-newsreader text-xl sm:text-2xl font-bold text-[#1a1c1b] flex items-center gap-2">
                        <span className="text-[#b5891a]">§</span> {point.title}
                      </h2>
                      <p className="font-newsreader text-base sm:text-lg text-slate-800 leading-relaxed">
                        {point.content}
                      </p>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4 border-t border-[#e8e6df]">
                    <h3 className="font-sans-ui text-xs font-bold uppercase tracking-wider text-slate-500">
                      Conclusión y Cierre Homilético
                    </h3>
                    <p className="font-newsreader text-base sm:text-lg text-slate-800 leading-relaxed">
                      {sermon.outline.conclusion}
                    </p>
                  </div>

                  {sermon.outline.application && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider block font-sans-ui">
                        Aplicación Pastoral Directa
                      </span>
                      <p className="font-newsreader text-sm sm:text-base italic">
                        {sermon.outline.application}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="font-newsreader text-base sm:text-lg text-slate-800 leading-relaxed">
                    {sermon.description}
                  </p>
                  <p className="text-sm text-slate-600 font-sans-ui italic">
                    El texto completo del manuscrito se encuentra indexado en los archivos locales correspondientes a {sermon.file}.
                  </p>
                </div>
              )}
            </div>

            {/* Document Archival Footer */}
            <div className="pt-8 mt-4 border-t border-[#e8e6df] text-center text-xs text-slate-400 font-sans-ui">
              — Fin del Manuscrito Canónico • Archivo Canónico Personal de Predicaciones —
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
