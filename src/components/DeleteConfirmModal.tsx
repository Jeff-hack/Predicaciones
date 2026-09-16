import React from 'react';
import { Sermon } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  sermon: Sermon | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  sermon,
  onConfirm,
  onCancel,
}) => {
  if (!sermon) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1c2c]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 border border-[#e2dfd7]">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="font-newsreader text-xl font-bold text-[#1a1c1b]">
            Confirmar eliminación
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          ¿Estás seguro de que deseas eliminar la predicación{' '}
          <strong className="text-slate-900 font-semibold">"{sermon.title}"</strong>?
          Esta acción removerá el registro del catálogo canónico y el archivo PDF asociado en tu equipo local.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#f4f4f2] hover:bg-[#eae8e4] text-slate-700 font-medium text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
