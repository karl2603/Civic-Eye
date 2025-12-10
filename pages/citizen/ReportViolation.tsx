import React, { useState } from 'react';

export default function ReportViolation() {
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  // ✅ FAKE AI DETECTION (NO BACKEND NEEDED)
  const handleExtractPlate = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fake detected plate number for demo
      const fakeDetectedPlate = 'TN10AB1234';
      setPlateNumber(fakeDetectedPlate);
    } catch (err) {
      setError('An error occurred while detecting the plate');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Report Traffic Violation (AI)</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="plateInput" style={{ display: 'block', marginBottom: '8px' }}>
          Vehicle Number Plate
        </label>
        <input
          id="plateInput"
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="Enter or detect plate number"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="imageInput" style={{ display: 'block', marginBottom: '8px' }}>
          Upload Vehicle Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          style={{
            display: 'block',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleExtractPlate}
          disabled={isDetecting}
          style={{
            padding: '10px 20px',
            backgroundColor: isDetecting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isDetecting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isDetecting ? 'Detecting...' : 'Detect from Image'}
        </button>

        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
