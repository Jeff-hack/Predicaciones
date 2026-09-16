import React, { useState } from 'react';
import { ViewType } from '../types';
import { Settings, Plus, User, BookOpen, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenNewSermon: () => void;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenNewSermon,
  onOpenConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'catalogo', label: 'Catálogo General' },
    { id: 'series', label: 'Series y Temas' },
    { id: 'indice', label: 'Índice Bíblico' },
    { id: 'predicadores', label: 'Predicadores' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#0f1c2c] shadow-[0_4px_20px_rgba(15,28,44,0.25)] border-b border-[#1f3148]">
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => { onSelectView('catalogo'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1UxV2nllYCi7i8YfiYNgZjO3qM-3rU4mkEVV_-FsagerXCZeBRFle7uw0fop3hx_mwf6X3rvZFvuf55bcQMbfgCCaRQwf-Y28mf1MyaZ7C3mBTiaQsGZ8l669isFb9B-P6NlPaWX0hDfN3kppMa5Gp7X7EQCeVx91vinM720B9LaBkPZ2nbuf3n30m60LneKwqKWudOkGBnuiXZCjZOxbi-QXpHRRl7Fppa6LsKfk7Qcnjg0rVyYCcW4g"
            alt="Biblioteca de Predicaciones"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback if image URL is inaccessible
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const icon = document.createElement('div');
                icon.className = 'fallback-icon p-2 rounded bg-amber-500/20 text-amber-400';
                icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>';
                parent.insertBefore(icon, parent.firstChild);
              }
            }}
          />
          <div className="flex flex-col">
            <span className="font-newsreader text-xl sm:text-2xl text-white font-semibold tracking-tight leading-none group-hover:text-amber-200 transition-colors">
              Biblioteca de Predicaciones
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-normal tracking-wide mt-1">
              Mi colección personal de predicaciones en PDF
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`text-sm tracking-wide transition-all font-medium py-1 relative ${
                  isActive
                    ? 'text-amber-300 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenConfig}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-100 hover:text-white text-sm font-medium transition-all border border-white/10"
            title="Configuración y Respaldo"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>Configuración y Respaldo</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewSermon}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#d0a531] hover:bg-[#eec14b] text-[#0f1c2c] font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(208,165,49,0.35)] active:scale-95"
            title="Añadir una nueva prédica"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva predicación</span>
          </button>

          {/* User profile avatar */}
          <div 
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-amber-400/50 cursor-pointer transition-all"
            title="Rodrigo Castellano Alvares (Usuario)"
          >
            <User className="w-4 h-4" />
          </div>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a1420] border-t border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => {
                onOpenConfig();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              <Settings className="w-4 h-4 text-amber-300" />
              <span>Configuración y Respaldo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
