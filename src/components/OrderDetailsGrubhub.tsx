import { ArrowLeft, Star, Clock, MapPin, Info, User } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface OrderDetailsGrubhubProps {
  onNavigate: (screen: Screen) => void;
}

export function OrderDetailsGrubhub({ onNavigate }: OrderDetailsGrubhubProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #FDB515 0%, #f4a700 100%)' }}>
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1" style={{ fontSize: '24px', fontWeight: '700' }}>
            Grubhub Order
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Restaurant Info */}
        <div className="px-6 py-8 bg-gray-50">
          <h2 className="mb-2" style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            Brown's Cafe
          </h2>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: '#6B7280' }} />
            <span style={{ fontSize: '16px', color: '#6B7280' }}>
              Unit 3 Lobby
            </span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FDB515' }}>
              <span className="text-white" style={{ fontSize: '24px', fontWeight: '600' }}>
                EW
              </span>
            </div>
            <div className="flex-1">
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                Emma W.
              </h3>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-4 h-4 fill-current" 
                    style={{ color: '#FDB515' }} 
                  />
                ))}
                <span style={{ fontSize: '14px', color: '#6B7280', marginLeft: '4px' }}>
                  4.9 (18 reviews)
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
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#FDB515' }}>
              $10
            </span>
          </div>

          {/* Pickup Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" style={{ color: '#FDB515' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Estimated Pickup
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                6:45 PM
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                Today
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" style={{ color: '#FDB515' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Order Name
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p style={{ fontSize: '15px', color: '#374151' }}>
                Order under name: <span style={{ fontWeight: '600' }}>Alex</span>
              </p>
            </div>
          </div>

          {/* Verification Code */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5" style={{ color: '#FDB515' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Verification Code
              </span>
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#FEF3C7' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#92400E', letterSpacing: '2px', textAlign: 'center' }}>
                5738
              </p>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" style={{ color: '#FDB515' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Pickup Instructions
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
                Order will be ready at Unit 3 lobby front desk. Look for a bag with the name "Alex". Show the verification code to confirm. Max order amount: $12
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 rounded-xl" style={{ background: '#FEF3C7' }}>
            <p style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.5' }}>
              <span style={{ fontWeight: '600' }}>How it works:</span> Order food from this restaurant using the seller's Grubhub swipe. Pick up the order at the specified location and time. Payment is processed after confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <Button
            onClick={() => onNavigate('chat-grubhub')}
            className="flex-1 h-14 rounded-2xl border-2"
            style={{ 
              borderColor: '#FDB515',
              background: 'white',
              color: '#FDB515',
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
              background: 'linear-gradient(135deg, #FDB515 0%, #f4a700 100%)',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Request Order
          </Button>
        </div>
      </div>
    </div>
  );
}