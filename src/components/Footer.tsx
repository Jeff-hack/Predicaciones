import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f4f4f2] border-t border-[#e2dfd7] mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-newsreader text-base font-bold text-[#1a1c1b]">
            Biblioteca de Predicaciones
          </span>
          <span className="text-xs text-slate-500 font-sans-ui">
            — Archivo Canónico Personal
          </span>
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-3 font-sans-ui">
          <span>Almacenamiento Local Seguro</span>
          <span>•</span>
          <span>Exportación en PDF & Concordancia</span>
        </div>
      </div>
    </footer>
  );
};
