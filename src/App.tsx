/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sermon, ViewType, FilterOptions } from './types';
import { INITIAL_SERMONS } from './data/initialSermons';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { FilterBar } from './components/FilterBar';
import { SermonCard } from './components/SermonCard';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SermonFormModal } from './components/SermonFormModal';
import { ConfigModal } from './components/ConfigModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SeriesView } from './components/SeriesView';
import { BibleIndexView } from './components/BibleIndexView';
import { PreachersView } from './components/PreachersView';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { BookOpen, PlusCircle, SearchX } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'biblioteca_predicaciones_canonica_v1';

export default function App() {
  // Persistence state
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading sermons from localStorage', e);
    }
    return INITIAL_SERMONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sermons));
    } catch (e) {
      console.error('Error saving sermons to localStorage', e);
    }
  }, [sermons]);

  // Views & Modals state
  const [activeView, setActiveView] = useState<ViewType>('catalogo');
  const [selectedPdfSermon, setSelectedPdfSermon] = useState<Sermon | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [deletingSermon, setDeletingSermon] = useState<Sermon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    theme: 'all',
    category: 'all',
    sort: 'recent',
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Available themes for dropdown
  const availableThemes = useMemo(() => {
    const defaultThemes = [
      'Propósito de Dios en medio de la prueba',
      'Intimidad y unidad en el creyente',
      'La soberanía y el amor de Dios',
      'Compromiso radical con el Maestro',
      'Evangelismo',
      'Liderazgo',
      'Familia',
      'Escatología',
    ];
    const sermonThemes = sermons.map((s) => s.theme);
    return Array.from(new Set([...defaultThemes, ...sermonThemes]));
  }, [sermons]);

  // Filter and sort sermons
  const filteredSermons = useMemo(() => {
    return sermons
      .filter((item) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTheme = item.theme.toLowerCase().includes(q);
          const matchScripture = item.scripture.toLowerCase().includes(q);
          const matchPreacher = item.preacher.toLowerCase().includes(q);
          const matchDate = item.displayDate.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchDesc = item.description.toLowerCase().includes(q);
          if (!matchTitle && !matchTheme && !matchScripture && !matchPreacher && !matchDate && !matchTags && !matchDesc) {
            return false;
          }
        }

        // Date filter
        if (filters.dateRange === '2026') {
          if (!item.date.startsWith('2026')) return false;
        } else if (filters.dateRange === '2025') {
          if (!item.date.startsWith('2025')) return false;
        } else if (filters.dateRange === 'recent-month') {
          const d = new Date(item.date).getTime();
          const refDate = new Date('2026-09-08').getTime();
          const diffDays = (refDate - d) / (1000 * 3600 * 24);
          if (diffDays > 35 || diffDays < 0) return false;
        }

        // Theme filter
        if (filters.theme !== 'all' && item.theme !== filters.theme) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filters.sort === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sort === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (filters.sort === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [sermons, filters]);

  // Handlers
  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateRange: 'all',
      theme: 'all',
      category: 'all',
      sort: 'recent',
    });
    triggerToast('Filtros restablecidos');
  };

  const handleOpenCreateModal = () => {
    setEditingSermon(null);
    setIsFormModalOpen(true);
  };

  const handleEditSermon = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setIsFormModalOpen(true);
  };

  const handleSaveSermon = (data: Partial<Sermon>) => {
    if (editingSermon) {
      setSermons((prev) =>
        prev.map((s) => (s.id === editingSermon.id ? ({ ...s, ...data } as Sermon) : s))
      );
      triggerToast('Predicación actualizada correctamente');
    } else {
      const newSermon: Sermon = {
        id: 'sermon-' + Date.now(),
        title: data.title || 'Nueva Predicación',
        theme: data.theme || 'Propósito Bíblico',
        date: data.date || '2026-09-07',
        displayDate: data.displayDate || '07/09/2026',
        scripture: data.scripture || 'Ester 4:14',
        bibleBook: data.bibleBook || 'Ester',
        testament: data.testament || 'AT',
        preacher: data.preacher || 'Rodrigo Castellano Alvares',
        category: data.category || 'Predicación',
        tags: data.tags || ['fe', 'llamado'],
        file: data.file || 'manuscrito.pdf',
        fileSize: data.fileSize || '1.2 MB',
        pageCount: data.pageCount || 4,
        description: data.description || 'Manuscrito expositivo canónico indexado.',
        proposition: data.proposition || data.description || 'Fidelidad al llamado de Dios.',
      };
      setSermons((prev) => [newSermon, ...prev]);
      triggerToast('Nueva predicación añadida al catálogo');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingSermon) return;
    setSermons((prev) => prev.filter((s) => s.id !== deletingSermon.id));
    setDeletingSermon(null);
    triggerToast('Predicación eliminada del archivo local');
  };

  const handleDownloadPdf = (sermon: Sermon) => {
    // Generate text/markdown file download simulating local PDF export
    const content = `# ${sermon.title}
Pasaje: ${sermon.scripture}
Predicador: ${sermon.preacher}
Fecha: ${sermon.displayDate}
Categoría: ${sermon.category}
Tema: ${sermon.theme}

## Proposición Homilética
${sermon.proposition || sermon.description}

## Resumen del Manuscrito
${sermon.description}

${sermon.outline ? `
### Introducción
${sermon.outline.intro}

${sermon.outline.points.map((p) => `### ${p.title}\n${p.content}`).join('\n\n')}

### Conclusión
${sermon.outline.conclusion}

### Aplicación
${sermon.outline.application || ''}
` : ''}

---
Biblioteca de Predicaciones — Archivo Canónico Personal
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sermon.file.replace(/\.pdf$/, '') + '_manuscrito.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Descargando "${sermon.file}"...`);
  };

  const handleSelectSeriesFilter = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      search: keyword,
    }));
    setActiveView('catalogo');
    triggerToast(`Filtrando por serie: ${keyword}`);
  };

  const handleSelectBookFilter = (bookName: string) => {
    setFilters((prev) => ({
      ...prev,
      search: bookName,
    }));
    setActiveView('catalogo');
    triggerToast(`Filtrando por libro: ${bookName}`);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-[#1a1c1b] flex flex-col font-sans-ui selection:bg-amber-200 selection:text-slate-900">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenNewSermon={handleOpenCreateModal}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex flex-col gap-8 w-full">
          {activeView === 'catalogo' && (
            <>
              {/* SECTION 1: METRICS & STATS BAR */}
              <MetricsBar
                sermons={sermons}
                onSelectRecentSermon={(sermon) => setSelectedPdfSermon(sermon)}
              />

              {/* SECTION 2: SEARCH & ADVANCED FILTER MATRIX */}
              <FilterBar
                filters={filters}
                onChangeFilters={setFilters}
                onResetFilters={handleResetFilters}
                filteredCount={filteredSermons.length}
                totalCount={sermons.length}
                availableThemes={availableThemes}
              />

              {/* SECTION 3: SERMON GALLERY TITLE BAR */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-[#d0a531]/15 text-[#9c6f09]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="font-newsreader text-2xl sm:text-3xl font-bold text-[#1a1c1b]">
                    Mis predicaciones
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f1c2c] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span>Añadir prédica</span>
                </button>
              </div>

              {/* SECTION 4: SERMON GALLERY GRID */}
              {filteredSermons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
                  {filteredSermons.map((sermon) => (
                    <SermonCard
                      key={sermon.id}
                      sermon={sermon}
                      onViewPdf={(s) => setSelectedPdfSermon(s)}
                      onDownloadPdf={handleDownloadPdf}
                      onEditSermon={handleEditSermon}
                      onDeleteSermon={(s) => setDeletingSermon(s)}
                    />
                  ))}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white rounded-xl border border-[#e2dfd7] shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <SearchX className="w-8 h-8" />
                  </div>
                  <h3 className="font-newsreader text-2xl font-bold text-[#1a1c1b]">
                    Sin predicaciones encontradas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-2 leading-relaxed">
                    No se encontraron manuscritos con los criterios de búsqueda seleccionados. Intenta restablecer los filtros o utilizar otras palabras clave.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 px-5 py-2.5 rounded-lg bg-[#d0a531] hover:bg-[#b5891a] text-[#0f1c2c] hover:text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    Restablecer todos los filtros
                  </button>
                </div>
              )}
            </>
          )}

          {activeView === 'series' && (
            <SeriesView
              sermons={sermons}
              onSelectSeries={handleSelectSeriesFilter}
            />
          )}

          {activeView === 'indice' && (
            <BibleIndexView
              sermons={sermons}
              onSelectBook={handleSelectBookFilter}
              onOpenPdf={(s) => setSelectedPdfSermon(s)}
            />
          )}

          {activeView === 'predicadores' && (
            <PreachersView
              sermons={sermons}
              onOpenPdf={(s) => setSelectedPdfSermon(s)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        sermon={selectedPdfSermon}
        onClose={() => setSelectedPdfSermon(null)}
        onDownload={handleDownloadPdf}
      />

      {/* Sermon Form Modal (Create or Edit) */}
      <SermonFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSermon}
        initialSermon={editingSermon}
      />

      {/* Configuration & Local Backup Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        sermons={sermons}
        onRestoreSermons={(imported) => setSermons(imported)}
        onResetToDefaults={() => setSermons(INITIAL_SERMONS)}
        onShowToast={triggerToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        sermon={deletingSermon}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSermon(null)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
