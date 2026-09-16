import React from 'react';
import { Sermon } from '../types';
import { BookMarked, ArrowRight } from 'lucide-react';

interface BibleIndexViewProps {
  sermons: Sermon[];
  onSelectBook: (bookName: string) => void;
  onOpenPdf: (sermon: Sermon) => void;
}

interface BibleSection {
  name: string;
  testament: 'AT' | 'NT';
  books: {
    name: string;
    description: string;
  }[];
}

const BIBLE_STRUCTURE: BibleSection[] = [
  {
    name: 'Antiguo Testamento — Libros Históricos y Sabiduría',
    testament: 'AT',
    books: [
      { name: 'Génesis', description: 'Orígenes y pacto patriarcal' },
      { name: 'Éxodo', description: 'Redención y ley divina' },
      { name: 'Ester', description: 'Providencia soberana y liberación' },
      { name: 'Salmos', description: 'Adoración, lamentación y alabanza' },
      { name: 'Proverbios', description: 'Sabiduría práctica en el temor del Señor' },
      { name: 'Isaías', description: 'El siervo sufriente y el Reino mesiánico' },
    ]
  },
  {
    name: 'Nuevo Testamento — Evangelios y Hechos',
    testament: 'NT',
    books: [
      { name: 'Mateo', description: 'El Rey y el Reino de los cielos' },
      { name: 'Marcos', description: 'El Siervo de poder y acción' },
      { name: 'Lucas', description: 'El Hijo del Hombre y los quebrantados' },
      { name: 'Juan', description: 'El Verbo encarnado y la vida eterna' },
      { name: 'Hechos', description: 'El Espíritu Santo y la misión eclesial' },
    ]
  },
  {
    name: 'Nuevo Testamento — Epístolas Paulinas y Generales',
    testament: 'NT',
    books: [
      { name: 'Romanos', description: 'El Evangelio de la justicia y la justificación' },
      { name: '1 Corintios', description: 'Orden, santidad y amor en la congregación' },
      { name: 'Efesios', description: 'La iglesia en los lugares celestiales' },
      { name: 'Filipenses', description: 'El gozo constante en la comunión del evangelio' },
      { name: 'Hebreos', description: 'La supremacía absoluta de Cristo y su sacerdocio' },
    ]
  }
];

export const BibleIndexView: React.FC<BibleIndexViewProps> = ({
  sermons,
  onSelectBook,
  onOpenPdf,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2dfd7] pb-4">
        <div>
          <h2 className="font-newsreader text-2xl sm:text-3xl font-bold text-[#1a1c1b] flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-[#b5891a]" />
            Índice Bíblico Canónico
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explora las predicaciones clasificadas por el libro de las Sagradas Escrituras expuesto.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {BIBLE_STRUCTURE.map((section, sIdx) => (
          <div key={sIdx} className="bg-white rounded-xl border border-[#e2dfd7] shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${section.testament === 'AT' ? 'bg-[#d0a531]' : 'bg-[#0f1c2c]'}`} />
              {section.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.books.map((book) => {
                const bookSermons = sermons.filter(s =>
                  s.scripture.toLowerCase().includes(book.name.toLowerCase()) ||
                  s.bibleBook.toLowerCase() === book.name.toLowerCase()
                );
                const hasSermons = bookSermons.length > 0;

                return (
                  <div
                    key={book.name}
                    className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                      hasSermons
                        ? 'bg-[#fbfbf9] border-[#d0a531]/40 hover:border-[#d0a531] shadow-xs'
                        : 'bg-[#f9f9f7]/50 border-[#e2dfd7]/60 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-newsreader text-lg font-bold text-[#1a1c1b]">
                          {book.name}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            hasSermons
                              ? 'bg-[#d0a531] text-[#0f1c2c]'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {bookSermons.length} {bookSermons.length === 1 ? 'prédica' : 'prédicas'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {book.description}
                      </p>
                    </div>

                    {hasSermons && (
                      <div className="mt-3 pt-3 border-t border-[#e8e6df] space-y-1.5">
                        {bookSermons.map(bs => (
                          <div
                            key={bs.id}
                            onClick={() => onOpenPdf(bs)}
                            className="text-xs font-medium text-[#b5891a] hover:underline cursor-pointer flex items-center justify-between group"
                          >
                            <span className="truncate max-w-[200px]">{bs.title}</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
