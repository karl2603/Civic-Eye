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

  const [plateNumber, setPlateNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');
  const [ocrPreview, setOcrPreview] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    }
  };

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
      formDataToSend.append('apikey', 'K83171064488957');
      formDataToSend.append('isOverlayRequired', 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('OCR request failed');
      }

      const result: any = await response.json();

      if (result.IsErroredOnProcessing) {
        const apiError =
          (Array.isArray(result.ErrorMessage) && result.ErrorMessage[0]) ||
          result.ErrorMessage ||
          'OCR processing error';
        throw new Error(apiError);
      }

      const parsedTextRaw: string = Array.isArray(result.ParsedResults)
        ? result.ParsedResults.map((r: any) => r.ParsedText || '').join('\n')
        : result?.ParsedResults?.ParsedText || '';

      const parsedText = parsedTextRaw.toUpperCase();

      if (!parsedText.trim()) {
        setDetectError(
          'AI could not read any text. Try a closer, clearer number plate image or type manually.'
        );
        return;
      }

      setOcrPreview(parsedTextRaw.trim());

      const cleaned = parsedText.replace(/[^A-Z0-9]/g, '');
      const strictMatch = cleaned.match(
        /[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{3,4}/
      );

      const relaxedMatches = cleaned.match(/[A-Z0-9]{6,12}/g) || [];
      let bestCandidate = '';

      if (strictMatch && strictMatch[0]) {
        bestCandidate = strictMatch[0];
      } else if (relaxedMatches.length > 0) {
        bestCandidate = relaxedMatches.sort((a, b) => b.length - a.length)[0];
      } else {
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

      bestCandidate = bestCandidate.replace(/[^A-Z0-9]/g, '').toUpperCase();

      bestCandidate = bestCandidate
        .replace(/^11/, 'TN')
        .replace(/^1N/, 'TN')
        .replace(/^N1/, 'TN')
        .replace(/^10/, 'TN')
        .replace(/^I1/, 'TN');

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
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
