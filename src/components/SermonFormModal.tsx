import React, { useState, useEffect } from 'react';
import { Sermon } from '../types';
import { UploadCloud, X, Check, FileText } from 'lucide-react';

interface SermonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sermonData: Partial<Sermon>) => void;
  initialSermon?: Sermon | null;
}

export const SermonFormModal: React.FC<SermonFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSermon,
}) => {
  const [title, setTitle] = useState('');
  const [scripture, setScripture] = useState('');
  const [theme, setTheme] = useState('');
  const [date, setDate] = useState('2026-09-07');
  const [category, setCategory] = useState<'Predicación' | 'Estudio Bíblico' | 'Conferencia'>('Predicación');
  const [preacher, setPreacher] = useState('Rodrigo Castellano Alvares');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [proposition, setProposition] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialSermon) {
      setTitle(initialSermon.title);
      setScripture(initialSermon.scripture);
      setTheme(initialSermon.theme);
      setDate(initialSermon.date);
      setCategory(initialSermon.category);
      setPreacher(initialSermon.preacher);
      setTags(initialSermon.tags.join(', '));
      setDescription(initialSermon.description);
      setProposition(initialSermon.proposition || initialSermon.description);
      setFileName(initialSermon.file);
    } else {
      setTitle('');
      setScripture('');
      setTheme('');
      setDate('2026-09-07');
      setCategory('Predicación');
      setPreacher('Rodrigo Castellano Alvares');
      setTags('');
      setDescription('');
      setProposition('');
      setFileName('');
    }
  }, [initialSermon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scripture.trim()) return;

    // Determine Bible book and Testament
    const scriptureTrimmed = scripture.trim();
    const bookWord = scriptureTrimmed.split(' ')[0] || 'Biblia';
    
    // Simple heuristic for Old Testament vs New
    const otBooks = ['Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut', 'Samuel', 'Reyes', 'Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos', 'Salmo', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías'];
    const isOT = otBooks.some(b => scriptureTrimmed.toLowerCase().includes(b.toLowerCase()));

    const tagsArray = tags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    // Format display date DD/MM/YYYY
    const [year, month, day] = date.split('-');
    const displayDate = year && month && day ? `${day}/${month}/${year}` : date;

    const generatedFileName = fileName || (
      title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') + '.pdf'
    );

    onSave({
      ...(initialSermon ? { id: initialSermon.id } : {}),
      title: title.trim(),
      scripture: scriptureTrimmed,
      bibleBook: bookWord,
      testament: isOT ? 'AT' : 'NT',
      theme: theme.trim() || 'Doctrina Bíblica',
      date,
      displayDate,
      category,
      preacher: preacher.trim() || 'Rodrigo Castellano Alvares',
      tags: tagsArray.length > 0 ? tagsArray : ['predicación'],
      description: description.trim() || 'Manuscrito expositivo canónico indexado en la biblioteca.',
      proposition: proposition.trim() || description.trim(),
      file: generatedFileName,
      fileSize: initialSermon?.fileSize || '1.5 MB',
      pageCount: initialSermon?.pageCount || 4,
    });

    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1c2c]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#e2dfd7]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f4f4f2] border-b border-[#e2dfd7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d0a531]/20 text-[#b5891a] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-newsreader text-xl font-bold text-[#1a1c1b]">
              {initialSermon ? 'Editar predicación' : 'Nueva predicación'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Título de la predicación <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej. ¿Para qué Dios te tiene aquí?"
              className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
            />
          </div>

          {/* Scripture & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Texto bíblico principal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder="ej. Ester 4:13-17"
                className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Tema doctrinal principal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="ej. Propósito de Dios en medio de la prueba"
                className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
              />
            </div>
          </div>

          {/* Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Fecha impartida <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Categoría homilética <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none cursor-pointer"
              >
                <option value="Predicación">Predicación</option>
                <option value="Estudio Bíblico">Estudio Bíblico</option>
                <option value="Conferencia">Conferencia</option>
              </select>
            </div>
          </div>

          {/* Preacher */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Predicador o Expositor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={preacher}
              onChange={(e) => setPreacher(e.target.value)}
              placeholder="Nombre completo del expositor"
              className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ester, propósito, soberanía, fe, llamado"
              className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none"
            />
          </div>

          {/* Proposition / Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Resumen o Proposición Homilética
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setProposition(e.target.value);
              }}
              placeholder="Escribe la tesis o resumen teológico central de este sermón..."
              className="w-full bg-[#f4f4f2] focus:bg-white text-[#1a1c1b] py-2 px-3 rounded-lg border border-[#e2dfd7] focus:border-[#d0a531] focus:ring-1 focus:ring-[#d0a531] outline-none resize-none font-newsreader text-sm"
            />
          </div>

          {/* PDF Dropzone Area */}
          <div className="space-y-1 pt-1">
            <label className="font-semibold text-slate-700 block">
              Manuscrito en archivo PDF
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('sermonFileInput')?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#d0a531] bg-amber-50/50'
                  : 'border-[#e2dfd7] hover:border-[#d0a531] bg-[#fbfbf9]'
              }`}
            >
              <UploadCloud className="w-8 h-8 mx-auto text-[#b5891a] mb-1.5" />
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Arrastra tu archivo PDF aquí o <span className="text-[#b5891a] underline font-semibold">haz clic para explorar</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                {fileName ? `Archivo seleccionado: ${fileName}` : 'Formato compatible: PDF (máx. 25MB)'}
              </p>
              <input
                id="sermonFileInput"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eee9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f4f4f2] hover:bg-[#eae8e4] text-slate-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#d0a531] hover:bg-[#b5891a] text-[#0f1c2c] hover:text-white font-semibold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Guardar en Biblioteca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
