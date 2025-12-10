import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VIOLATION_TYPES } from '../../constants';
import {
  Camera,
  MapPin,
  Upload,
  X,
  FileText,
  Lock,
  Car,
  Check,
} from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const SubmitReport: React.FC<Props> = ({ onSuccess }) => {
  const { addReport } = useApp();

  const [formData, setFormData] = useState({
    violationTypes: [] as string[],
    vehicleNumber: '',
    location: '',
    description: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔹 AI Plate Detection States
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');
  const [ocrPreview, setOcrPreview] = useState('');

  // 🔹 Generic input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Toggle violation types
  const toggleViolationType = (label: string) => {
    setFormData((prev) => {
      const exists = prev.violationTypes.includes(label);
      return {
        ...prev,
        violationTypes: exists
          ? prev.violationTypes.filter((t) => t !== label)
          : [...prev.violationTypes, label],
      };
    });
  };

  // 🔹 Evidence upload handler (top section)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  // 🔥 REAL OCR-BASED AI PLATE DETECTION (inside this component)
  const handleExtractPlate = async () => {
    if (!selectedImage) {
      setDetectError('Please select an image first');
      return;
    }

    setIsDetecting(true);
    setDetectError('');
    setOcrPreview('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedImage);
      formDataToSend.append('language', 'eng');
      formDataToSend.append('apikey', 'K83171064488957'); // ← your OCR.space API key
      formDataToSend.append('isOverlayRequired', 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('OCR request failed');
      }

      const result: any = await response.json();
      console.log('OCR result:', result);

      if (result.IsErroredOnProcessing) {
        const apiError =
          (Array.isArray(result.ErrorMessage) && result.ErrorMessage[0]) ||
          result.ErrorMessage ||
          'OCR processing error';
        throw new Error(apiError);
      }

      // Merge all ParsedResults text into one string
      const parsedTextRaw: string = Array.isArray(result.ParsedResults)
        ? result.ParsedResults.map((r: any) => r.ParsedText || '').join('\n')
        : result?.ParsedResults?.ParsedText || '';

      const parsedText = parsedTextRaw.toUpperCase();
      console.log('ParsedText:', parsedText);

      if (!parsedText.trim()) {
        setDetectError(
          'AI could not read any text. Try a closer, clearer number plate image or type manually.'
        );
        return;
      }

      // Show OCR preview under the button (for user to see what AI saw)
      setOcrPreview(parsedTextRaw.trim());

      // 1️⃣ Strict Indian-style match (example pattern)
      const cleaned = parsedText.replace(/[^A-Z0-9]/g, '');
      const strictMatch = cleaned.match(
        /[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{3,4}/
      );

      // 2️⃣ Relaxed: any A–Z0–9 block length 6–12
      const relaxedMatches = cleaned.match(/[A-Z0-9]{6,12}/g) || [];

      let bestCandidate = '';

      if (strictMatch && strictMatch[0]) {
        bestCandidate = strictMatch[0];
      } else if (relaxedMatches.length > 0) {
        // choose the longest relaxed match
        bestCandidate = relaxedMatches.sort((a, b) => b.length - a.length)[0];
      } else {
        // 3️⃣ Fallback: first non-empty line of text
        const fallback = parsedTextRaw
          .split('\n')
          .map((l) => l.trim())
          .find((l) => l.length > 0);

        if (!fallback) {
          setDetectError(
            'Text was detected, but no number-like pattern was found. Please type it manually.'
          );
          return;
        }

        bestCandidate = fallback.toUpperCase();
      }

      // Final cleanup: keep only A–Z and 0–9
      bestCandidate = bestCandidate.replace(/[^A-Z0-9]/g, '').toUpperCase();

// ✅ SMART OCR CORRECTION FOR INDIAN PLATES
// Fix common OCR mistakes: 1 -> T, 1 -> N at starting
bestCandidate = bestCandidate
  .replace(/^11/, 'TN')   // 11 → TN
  .replace(/^1N/, 'TN')   // 1N → TN
  .replace(/^N1/, 'TN')   // N1 → TN
  .replace(/^10/, 'TN')   // 10 → TN (rare OCR bug)
  .replace(/^I1/, 'TN');  // I1 → TN

// ✅ Final Indian number plate validation
const finalMatch = bestCandidate.match(
  /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/
);
if (bestCandidate.length < 6) {
  setDetectError(
    'AI detected text, but it is too short to be a valid vehicle number. Please upload a clearer, closer image.'
  );
  return;
}

if (!finalMatch) {
  setDetectError(
  'Low visibility or angled plate detected. For best AI results, upload a clear, front-facing, well-lit number plate image.'
);
}

// ✅ Set even if not perfect (user can edit)
setPlateNumber(bestCandidate);
setFormData((prev) => ({ ...prev, vehicleNumber: bestCandidate }));

      setDetectError('');
    } catch (error: any) {
      console.error(error);
      setDetectError(
        error?.message || 'Failed to detect plate number. Please try again.'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.violationTypes.length === 0) {
      alert('Please select at least one violation type.');
      return;
    }


    setIsSubmitting(true);

    setTimeout(() => {
      addReport({
        violationTypes: formData.violationTypes,
        vehicleNumber: (plateNumber || formData.vehicleNumber).toUpperCase(),
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
      });

      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Report Violation
        </h1>
        <p className="text-slate-600 mt-1">
          Submit visual evidence of traffic violations.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Evidence (Photo/Video)
            </label>

            <div
              className={`group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer ${
                formData.imageUrl
                  ? 'border-blue-200 bg-slate-50'
                  : 'border-slate-300 hover:border-blue-500'
              }`}
              onClick={() =>
                !formData.imageUrl && fileInputRef.current?.click()
              }
            >
              {formData.imageUrl ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imageUrl}
                    alt="Evidence"
                    className="max-h-80 rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera />
                  <p>Click to upload evidence</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Violation Types */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex justify-between">
              <span>Violation Types</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {formData.violationTypes.length} selected
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
              {VIOLATION_TYPES.map((type) => {
                const isSelected = formData.violationTypes.includes(type.label);
                return (
                  <div
                    key={type.id}
                    onClick={() => toggleViolationType(type.label)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all select-none ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      {type.label}
                    </span>
                    {isSelected && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Number + AI + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Number + AI */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Vehicle Number
              </label>

              <div className="relative">
                <Car
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                />
                <input
                  type="text"
                  name="vehicleNumber"
                  placeholder="TN 10 AB 1234"
                  value={plateNumber || formData.vehicleNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value);
                    handleInputChange(e);
                  }}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl uppercase"
                />
              </div>

              {/* AI Detect section */}
              <div className="mt-3 flex flex-col gap-3">
                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="w-full max-h-64 object-contain rounded-lg border"
                    alt="Vehicle preview"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedImage(e.target.files?.[0] || null)
                  }
                />

                <button
                  type="button"
                  onClick={handleExtractPlate}
                  disabled={isDetecting}
                  className="bg-blue-600 text-white py-2 rounded-lg"
                >
                  {isDetecting ? 'Detecting...' : 'Detect from Image'}
                </button>

                {ocrPreview && (
                  <p className="text-[11px] text-slate-500 break-words">
                    AI detected text:{' '}
                    <span className="font-mono">
                      {ocrPreview.length > 120
                        ? ocrPreview.slice(0, 120) + '...'
                        : ocrPreview}
                    </span>
                  </p>
                )}

                {detectError && (
                  <p className="text-red-500 text-xs">{detectError}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. MG Road, Chennai"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3.5 top-4 text-slate-400"
                size={18}
              />
              <textarea
                name="description"
                rows={3}
                placeholder="Add any additional context details here..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Lock size={14} className="text-blue-500" />
              <span className="text-xs font-medium">
                Your identity remains 100% confidential.
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload size={20} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
