import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface IDVerificationScreenProps {
  onComplete: () => void;
}

export function IDVerificationScreen({ onComplete }: IDVerificationScreenProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: '700' }}>
            Verify Your Identity
          </h1>
          <p className="text-white/80" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            Upload your Cal 1 Card or student ID to verify you're a Berkeley student
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Upload Area */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {!uploadedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
              style={{
                borderColor: isDragging ? '#003262' : '#D1D5DB',
                background: isDragging ? '#F0F9FF' : '#F9FAFB'
              }}
            >
              <Upload 
                className="w-12 h-12 mx-auto mb-4" 
                style={{ color: isDragging ? '#003262' : '#9CA3AF' }} 
              />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Upload Student ID
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                Click to browse or drag and drop
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                PNG, JPG up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2" style={{ borderColor: '#059669' }}>
              <img 
                src={uploadedImage} 
                alt="Uploaded ID" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#059669' }} />
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-white shadow-lg"
                style={{ fontSize: '14px', fontWeight: '600', color: '#DC2626' }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: '#DBEAFE' }}>
            <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#1E40AF' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', marginBottom: '4px' }}>
                Why we need this
              </p>
              <p style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: '1.5' }}>
                ID verification ensures only UC Berkeley students can use the marketplace and helps maintain trust in our community.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: '#DCFCE7' }}>
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: '#166534' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                Your privacy matters
              </p>
              <p style={{ fontSize: '13px', color: '#14532D', lineHeight: '1.5' }}>
                Your ID is encrypted and only used for verification. We never share your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-6">
          <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Photo Guidelines
          </h3>
          <div className="space-y-2">
            {[
              'Make sure your full ID is visible',
              'Photo should be clear and well-lit',
              'Avoid glare or shadows',
              'ID must be valid and not expired'
            ].map((guideline, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FDB515' }}></div>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  {guideline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={onComplete}
          disabled={!uploadedImage}
          className="w-full h-14 rounded-2xl text-white shadow-lg disabled:opacity-50"
          style={{ 
            background: uploadedImage 
              ? 'linear-gradient(135deg, #003262 0%, #004d8b 100%)'
              : '#9CA3AF',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Continue
        </Button>
        <p className="text-center mt-3" style={{ fontSize: '12px', color: '#9CA3AF' }}>
          This usually takes 1-2 minutes to verify
        </p>
      </div>
    </div>
  );
}
