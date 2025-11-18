import { ArrowLeft, Star, Clock, MapPin, Info } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface OrderDetailsDiningProps {
  onNavigate: (screen: Screen) => void;
}

export function OrderDetailsDining({ onNavigate }: OrderDetailsDiningProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1" style={{ fontSize: '24px', fontWeight: '700' }}>
            Dining Hall Swipe
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Dining Hall Info */}
        <div className="px-6 py-8 bg-gray-50">
          <h2 className="mb-2" style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            Foothill
          </h2>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: '#6B7280' }} />
            <span style={{ fontSize: '16px', color: '#6B7280' }}>
              Foothill Dining Hall
            </span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#003262' }}>
              <span className="text-white" style={{ fontSize: '24px', fontWeight: '600' }}>
                SM
              </span>
            </div>
            <div className="flex-1">
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                Sarah M.
              </h3>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-4 h-4 fill-current" 
                    style={{ color: star <= 4 ? '#FDB515' : '#E5E7EB' }} 
                  />
                ))}
                <span style={{ fontSize: '14px', color: '#6B7280', marginLeft: '4px' }}>
                  4.8 (24 reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-6 space-y-6">
          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Price
            </span>
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#003262' }}>
              $6
            </span>
          </div>

          {/* Time Window */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" style={{ color: '#003262' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Available Time
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                5:30 PM – 7:00 PM
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                Today
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5" style={{ color: '#003262' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Instructions
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
                Meet at the main entrance of Foothill. I'll be wearing a blue Cal hoodie. Please message me when you're 5 minutes away!
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 rounded-xl" style={{ background: '#DBEAFE' }}>
            <p style={{ fontSize: '13px', color: '#1E40AF', lineHeight: '1.5' }}>
              <span style={{ fontWeight: '600' }}>How it works:</span> The seller will swipe you into the dining hall at the agreed time. Payment is processed after confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <Button
            onClick={() => onNavigate('chat-dining')}
            className="flex-1 h-14 rounded-2xl border-2"
            style={{ 
              borderColor: '#003262',
              background: 'white',
              color: '#003262',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Message Seller
          </Button>
          <Button
            onClick={() => onNavigate('orders-buyer')}
            className="flex-1 h-14 rounded-2xl text-white shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Request Swipe
          </Button>
        </div>
      </div>
    </div>
  );
}