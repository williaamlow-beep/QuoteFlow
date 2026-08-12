import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Tag,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Check,
  Sparkles,
  MapPin,
  Car,
} from 'lucide-react';
import { PhotoAnnotation, PhotoAttachment } from '../types';

interface PhotoAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: PhotoAttachment) => void;
  initialPhoto?: PhotoAttachment | null;
  tradeProfession?: string;
}

export const PhotoAnnotationModal: React.FC<PhotoAnnotationModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  initialPhoto,
  tradeProfession,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(
    initialPhoto?.url ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  );
  const [caption, setCaption] = useState(initialPhoto?.caption || '');
  const [damageArea, setDamageArea] = useState(initialPhoto?.damageArea || '');
  const [isCustomerVisible, setIsCustomerVisible] = useState(
    initialPhoto?.isCustomerVisible ?? true
  );
  const [annotations, setAnnotations] = useState<PhotoAnnotation[]>(
    initialPhoto?.annotations || []
  );

  const [newTagLabel, setNewTagLabel] = useState('');
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const imgRef = useRef<HTMLImageElement>(null);

  // Handle click on image to place tag
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPendingPoint({ x: xPct, y: yPct });
  };

  const handleAddAnnotation = () => {
    if (!pendingPoint || !newTagLabel.trim()) return;
    const newAnno: PhotoAnnotation = {
      id: `ann_${Date.now()}`,
      x: pendingPoint.x,
      y: pendingPoint.y,
      label: newTagLabel.trim(),
      color: '#ef4444',
    };
    setAnnotations([...annotations, newAnno]);
    setNewTagLabel('');
    setPendingPoint(null);
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  // Sample preset images if user wants quick test
  const sampleImages = [
    {
      name: 'Wall Repair / Drywall',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Car Dent / Panel Bumper',
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Plumbing Leak / Sink',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Aircon Unit Service',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const photo: PhotoAttachment = {
      id: initialPhoto?.id || `photo_${Date.now()}`,
      url,
      caption: caption || 'Site job inspection photo',
      damageArea: damageArea || 'Work Area',
      isCustomerVisible,
      annotations,
      createdAt: initialPhoto?.createdAt || new Date().toISOString(),
    };
    onSavePhoto(photo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">
              Job Photo & Damage Annotator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          {/* Photo Canvas Stage */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden group select-none min-h-[220px] flex items-center justify-center border border-slate-800">
            <div
              className="relative cursor-crosshair inline-block max-h-[380px]"
              onClick={handleImageClick}
            >
              <img
                ref={imgRef}
                src={url}
                alt="Job inspection"
                className="max-h-[380px] w-auto object-contain mx-auto"
              />

              {/* Render Tag Annotations */}
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/tag"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center animate-bounce">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="bg-slate-900/90 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap mt-1 -translate-x-1/3">
                    {ann.label}
                  </div>
                </div>
              ))}

              {/* Pending point marker */}
              {pendingPoint && (
                <div
                  style={{ left: `${pendingPoint.x}%`, top: `${pendingPoint.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg animate-ping" />
                </div>
              )}
            </div>

            <div className="absolute top-3 right-3 bg-slate-900/80 text-slate-200 text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs border border-slate-700 pointer-events-none">
              Click photo to add callout tag
            </div>
          </div>

          {/* Add Tag Form if point pending */}
          {pendingPoint && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                placeholder="Tag label (e.g. Front Bumper Dent, Wall Crack)..."
                className="flex-1 bg-white border border-amber-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 outline-none"
              />
              <button
                onClick={handleAddAnnotation}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          )}

          {/* Preset image selector or upload custom photo */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Sample photos:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(s.url)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px] transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>

            <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer transition-colors inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Tag List */}
          {annotations.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-700 text-xs">
                Annotated Callout Tags ({annotations.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {annotations.map((ann) => (
                  <span
                    key={ann.id}
                    className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium px-2.5 py-1 rounded-lg"
                  >
                    <Tag className="w-3 h-3 text-rose-600" />
                    <span>{ann.label}</span>
                    <button
                      onClick={() => handleDeleteAnnotation(ann.id)}
                      className="text-rose-400 hover:text-rose-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Caption & Damage Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Damage / Work Area Label
              </label>
              <input
                type="text"
                value={damageArea}
                onChange={(e) => setDamageArea(e.target.value)}
                placeholder="e.g. Front Bumper, Living Room Wall"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Photo Description / Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Crease dent before paint touchup..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          {/* Customer Visibility Toggle (Crucial!) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Customer PDF Document Visibility
              </span>
              <span className="text-[11px] text-slate-500">
                {isCustomerVisible
                  ? 'This photo will be included in customer quotes & invoice PDFs.'
                  : 'Internal-only photo. Hidden from customer PDF documents.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomerVisible(!isCustomerVisible)}
              className={`flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isCustomerVisible
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {isCustomerVisible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visible to Customer</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Internal Only</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Save */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Attach Photo to Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
