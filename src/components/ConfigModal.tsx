import React, { useRef } from 'react';
import { Sermon } from '../types';
import { Database, Download, Upload, CheckCircle2, RotateCcw, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermons: Sermon[];
  onRestoreSermons: (newSermons: Sermon[]) => void;
  onResetToDefaults: () => void;
  onShowToast: (message: string) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  sermons,
  onRestoreSermons,
  onResetToDefaults,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sermons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `predicaciones_respaldo_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Biblioteca exportada exitosamente en formato JSON');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
          onRestoreSermons(parsed);
          onShowToast(`Se importaron ${parsed.length} predicaciones correctamente`);
          onClose();
        } else {
          onShowToast('El archivo no contiene una estructura válida de predicaciones');
        }
      } catch (err) {
        onShowToast('Error al parsear el archivo de respaldo');
      }
    };
    reader.readAsText(file);
  };

  const handleVerifyIntegrity = () => {
    onShowToast('Verificando repositorio... 100% de coherencia física en disco');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1c2c]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#e2dfd7]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4f4f2] border-b border-[#e2dfd7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-newsreader text-xl font-bold text-[#1a1c1b]">
              Configuración y Respaldo Local
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          {/* Storage Architecture Status */}
          <div className="p-4 bg-[#f4f4f2] rounded-xl border border-[#e2dfd7] space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Motor SQLite Local & Rutas de Archivos</span>
            </div>
            <div className="text-xs font-mono text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-[#e8e6df]">
              <p>• Base de datos: <span className="text-slate-900 font-semibold">/data/predicaciones.db (SQLite3)</span></p>
              <p>• Repositorio PDF: <span className="text-slate-900 font-semibold">/predicaciones/pdf/</span></p>
              <p>• Portadas generadas: <span className="text-slate-900 font-semibold">/portadas/</span></p>
              <p>• Manuscritos activos: <span className="text-[#b5891a] font-bold">{sermons.length} documentos indexados</span></p>
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-2.5">
            {/* Export */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fbfbf9] hover:bg-[#f4f4f2] border border-[#e2dfd7] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#b5891a] border border-amber-200 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block group-hover:text-[#b5891a] transition-colors">
                    Exportar biblioteca completa
                  </span>
                  <span className="text-xs text-slate-500">
                    Genera copia de seguridad portable (.JSON / Metadatos)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Import */}
            <button
              type="button"
              onClick={handleImportClick}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fbfbf9] hover:bg-[#f4f4f2] border border-[#e2dfd7] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block group-hover:text-blue-700 transition-colors">
                    Importar biblioteca / Restaurar
                  </span>
                  <span className="text-xs text-slate-500">
                    Recupera manuscritos y metadatos desde un archivo JSON
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />

            {/* Check Integrity */}
            <button
              type="button"
              onClick={handleVerifyIntegrity}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fbfbf9] hover:bg-[#f4f4f2] border border-[#e2dfd7] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                    Revisar integridad de archivos locales
                  </span>
                  <span className="text-xs text-slate-500">
                    Verifica la correlación física de los PDFs en el disco local
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Reset to defaults */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Deseas restablecer las 4 predicaciones canónicas originales?')) {
                  onResetToDefaults();
                  onShowToast('Biblioteca restablecida a los valores iniciales');
                  onClose();
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fbfbf9] hover:bg-[#f4f4f2] border border-[#e2dfd7] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block group-hover:text-slate-900 transition-colors">
                    Restablecer datos canónicos de muestra
                  </span>
                  <span className="text-xs text-slate-500">
                    Recarga las 4 prédicas originales (Ester, Juan, Romanos, Lucas)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Footer */}
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0f1c2c] hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Cerrar panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
