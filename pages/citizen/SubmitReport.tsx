import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VIOLATION_TYPES } from '../../constants';
import { Camera, MapPin, AlertTriangle, Upload, X, FileText, Lock, Car, Check } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleViolationType = (label: string) => {
    setFormData((prev) => {
      const exists = prev.violationTypes.includes(label);
      if (exists) {
        return { ...prev, violationTypes: prev.violationTypes.filter(t => t !== label) };
      } else {
        return { ...prev, violationTypes: [...prev.violationTypes, label] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.violationTypes.length === 0) {
      alert("Please select at least one violation type.");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      addReport({
        violationTypes: formData.violationTypes,
        vehicleNumber: formData.vehicleNumber.toUpperCase(),
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report Violation</h1>
        <p className="text-slate-600 mt-1">Submit visual evidence of traffic violations. Select multiple if applicable.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Evidence (Photo/Video)</label>
            <div 
                className={`group relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out cursor-pointer ${
                    formData.imageUrl 
                    ? 'border-blue-200 bg-slate-50' 
                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30'
                }`}
                onClick={() => !formData.imageUrl && fileInputRef.current?.click()}
            >
              
              {formData.imageUrl ? (
                <div className="relative inline-block max-w-full">
                  <img src={formData.imageUrl} alt="Evidence Preview" className="max-h-80 rounded-lg shadow-lg" />
                  <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({...prev, imageUrl: ''}));
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={28} />
                  </div>
                  <p className="text-base text-slate-900 font-semibold">Click to upload photo or video</p>
                  <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, MP4 (Max 50MB)</p>
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

          <div className="space-y-6">
            {/* Violation Types (Multi-select) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex justify-between">
                <span>Violation Types</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{formData.violationTypes.length} selected</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                              <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{type.label}</span>
                              {isSelected && <Check size={16} className="text-blue-600" />}
                          </div>
                      )
                  })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Vehicle Number */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Number</label>
                <div className="relative">
                    <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        name="vehicleNumber"
                        placeholder="MH 12 AB 1234"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase placeholder-slate-400 font-medium font-mono"
                    />
                </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        name="location"
                        placeholder="e.g. MG Road, Pune"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                    </div>
                </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
            <div className="relative">
                <FileText className="absolute left-3.5 top-4 text-slate-400" size={18} />
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

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Lock size={14} className="text-blue-500" />
                <span className="text-xs font-medium">Your identity remains 100% confidential.</span>
             </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
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