import React from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onUpdate: (photos: PhotoItem[]) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onUpdate }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos: PhotoItem[] = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        description: '',
      }));
      onUpdate([...photos, ...newPhotos]);
    }
    // Reset input value to allow selecting the same files again if needed
    e.target.value = '';
  };

  const updateDescription = (id: string, description: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, description } : p));
    onUpdate(updated);
  };

  const removePhoto = (id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.previewUrl); // Cleanup memory
    }
    onUpdate(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="mt-6 border border-gray-300 bg-white shadow-sm print:shadow-none print:border-none break-inside-avoid">
      <div className="bg-gray-200 px-4 py-2 border-b border-gray-300 flex justify-between items-center print:border-b-2 print:border-black print:bg-transparent print:px-0">
        <h3 className="font-bold text-gray-700 text-sm uppercase print:text-black">Relatório Fotográfico</h3>
        <label className="no-print cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors">
          <Camera size={18} />
          <span>Adicionar Fotos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div className="p-4 bg-gray-50 min-h-[150px] print:bg-white print:p-0 print:mt-4">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-white print:border-gray-300">
            <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">Nenhuma foto anexada ao relatório.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-8">
            {photos.map((photo, index) => (
              <div key={photo.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden break-inside-avoid print:shadow-none print:border print:border-gray-300">
                <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-100 print:h-56 print:bg-gray-50">
                  <img
                    src={photo.previewUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm print:hidden">
                    Foto {index + 1}
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="no-print absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remover foto"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="p-3 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase print:text-black">Comentário:</label>
                    <span className="no-print text-[10px] text-gray-300 italic">Opcional</span>
                  </div>
                  <textarea
                    value={photo.description}
                    onChange={(e) => updateDescription(photo.id, e.target.value)}
                    placeholder="Descreva a atividade executada..."
                    className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded p-2 bg-gray-50 focus:bg-white transition-colors min-h-[60px] resize-y text-slate-900 print:border-none print:p-0 print:min-h-0 print:bg-transparent print:resize-none"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;