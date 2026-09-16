import React from 'react';
import { FilterOptions } from '../types';
import { Search, X, Calendar, Bookmark, Folder, ArrowUpDown, FilterX } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  availableThemes: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  filteredCount,
  totalCount,
  availableThemes,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, search: e.target.value });
  };

  const clearSearch = () => {
    onChangeFilters({ ...filters, search: '' });
  };

  return (
    <section className="bg-white p-5 rounded-xl border border-[#e2dfd7] shadow-sm flex flex-col gap-4">
      {/* Big Search Bar */}
      <div className="relative w-full flex items-center">
        <Search className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Buscar por título, tema, fecha, pasaje bíblico o palabra clave (ej. Ester, Juan 17, propósito, 2026)..."
          className="w-full pl-11 pr-11 py-3 bg-[#f4f4f2] hover:bg-[#ededeb] focus:bg-white text-[#1a1c1b] placeholder-slate-400 text-sm rounded-lg border border-transparent focus:border-[#d0a531] focus:ring-2 focus:ring-[#d0a531]/20 outline-none transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Matrix Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Temporalidad</span>
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onChangeFilters({ ...filters, dateRange: e.target.value })}
            className="w-full bg-[#f4f4f2] hover:bg-[#ededeb] text-[#1a1c1b] text-xs font-medium py-2 px-3 rounded-lg border border-[#e2dfd7] focus:outline-none focus:ring-1 focus:ring-[#d0a531] cursor-pointer"
          >
            <option value="all">Todas las fechas</option>
            <option value="2026">Año 2026</option>
            <option value="2025">Año 2025</option>
            <option value="recent-month">Último mes</option>
          </select>
        </div>

        {/* Theme Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Tema Doctrinal</span>
          </label>
          <select
            value={filters.theme}
            onChange={(e) => onChangeFilters({ ...filters, theme: e.target.value })}
            className="w-full bg-[#f4f4f2] hover:bg-[#ededeb] text-[#1a1c1b] text-xs font-medium py-2 px-3 rounded-lg border border-[#e2dfd7] focus:outline-none focus:ring-1 focus:ring-[#d0a531] cursor-pointer truncate"
          >
            <option value="all">Todos los temas</option>
            {availableThemes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-slate-500" />
            <span>Categoría</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChangeFilters({ ...filters, category: e.target.value })}
            className="w-full bg-[#f4f4f2] hover:bg-[#ededeb] text-[#1a1c1b] text-xs font-medium py-2 px-3 rounded-lg border border-[#e2dfd7] focus:outline-none focus:ring-1 focus:ring-[#d0a531] cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            <option value="Predicación">Predicación</option>
            <option value="Estudio Bíblico">Estudio Bíblico</option>
            <option value="Conferencia">Conferencia</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Ordenación</span>
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onChangeFilters({ ...filters, sort: e.target.value as FilterOptions['sort'] })}
            className="w-full bg-[#f4f4f2] hover:bg-[#ededeb] text-[#1a1c1b] text-xs font-medium py-2 px-3 rounded-lg border border-[#e2dfd7] focus:outline-none focus:ring-1 focus:ring-[#d0a531] cursor-pointer"
          >
            <option value="recent">Más recientes primero</option>
            <option value="oldest">Más antiguas primero</option>
            <option value="title-asc">Título (A - Z)</option>
            <option value="title-desc">Título (Z - A)</option>
          </select>
        </div>
      </div>

      {/* Active Count and Reset Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d0a531] animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">
            Mostrando {filteredCount} de {totalCount} predicaciones
          </span>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eeeeec] hover:bg-[#e2e2e0] text-slate-700 text-xs font-medium transition-colors"
          title="Restablecer todos los filtros"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Limpiar filtros</span>
        </button>
      </div>
    </section>
  );
};
