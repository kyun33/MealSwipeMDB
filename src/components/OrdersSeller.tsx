import { BottomNav } from './BottomNav';
import { Star, Clock, MapPin, User } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface OrdersSellerProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function OrdersSeller({ onNavigate, activeTab, onTabChange }: OrdersSellerProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '28px', fontWeight: '700' }}>
            Seller View
          </h1>
          <button
            onClick={() => onNavigate('orders-buyer')}
            className="px-4 py-2 rounded-xl text-white"
            style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '13px', fontWeight: '600' }}
          >
            Switch to Buyer
          </button>
        </div>
        <p className="text-white/80" style={{ fontSize: '14px' }}>
          Incoming requests for your offers
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Request 1 */}
          <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: '#FDB515' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#003262' }}>
                <span className="text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                  JD
                </span>
              </div>
              <div className="flex-1">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  Jason D.
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: '#FDB515' }} 
                    />
                  ))}
                  <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '4px' }}>
                    5.0
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#FDB515' }}>
                  $10
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: '600' }}>
                Grubhub Order
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Monsoon
              </h4>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Unit 3 Lobby
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    Requested pickup: 6:45 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onNavigate('chat-grubhub')}
                className="flex-1 py-3 rounded-xl border"
                style={{ 
                  borderColor: '#FDB515',
                  background: 'white',
                  color: '#FDB515',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Message Buyer
              </button>
              <button
                className="flex-1 py-3 rounded-xl text-white"
                style={{ 
                  background: '#10B981',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Accept Request
              </button>
            </div>
          </div>

          {/* Request 2 */}
          <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: '#003262' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FDB515' }}>
                <span className="text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                  MR
                </span>
              </div>
              <div className="flex-1">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  Maria R.
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: '#FDB515' }} 
                    />
                  ))}
                  <Star className="w-4 h-4" style={{ color: '#E5E7EB' }} />
                  <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '4px' }}>
                    4.2
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#003262' }}>
                  $6
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#DBEAFE', color: '#1E3A8A', fontSize: '12px', fontWeight: '600' }}>
                Dining Hall
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Foothill
              </h4>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    5:30 PM – 7:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-2"
                style={{ borderColor: '#DC2626', color: '#DC2626', fontSize: '14px', fontWeight: '600' }}
              >
                Decline
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl text-white"
                style={{ background: '#059669', fontSize: '14px', fontWeight: '600' }}
              >
                Accept
              </Button>
            </div>
          </div>

          {/* Request 3 */}
          <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: '#003262' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#6B7280' }}>
                <span className="text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                  KC
                </span>
              </div>
              <div className="flex-1">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  Kevin C.
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: '#FDB515' }} 
                    />
                  ))}
                  <Star className="w-4 h-4 fill-current" style={{ color: '#E5E7EB' }} />
                  <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '4px' }}>
                    4.6
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#003262' }}>
                  $7
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#DBEAFE', color: '#1E3A8A', fontSize: '12px', fontWeight: '600' }}>
                Dining Hall
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Cafe 3
              </h4>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    6:00 PM – 8:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-2"
                style={{ borderColor: '#DC2626', color: '#DC2626', fontSize: '14px', fontWeight: '600' }}
              >
                Decline
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl text-white"
                style={{ background: '#059669', fontSize: '14px', fontWeight: '600' }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}