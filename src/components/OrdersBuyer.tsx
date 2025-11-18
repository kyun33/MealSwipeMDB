import { useState } from 'react';
import { BottomNav } from './BottomNav';
import { Clock, MapPin, CheckCircle2, User } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface OrdersBuyerProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function OrdersBuyer({ onNavigate, activeTab, onTabChange }: OrdersBuyerProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-4" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white" style={{ fontSize: '28px', fontWeight: '700' }}>
            My Orders
          </h1>
          <button
            onClick={() => onNavigate('orders-seller')}
            className="px-4 py-2 rounded-xl text-white"
            style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '13px', fontWeight: '600' }}
          >
            Switch to Seller
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('active')}
            className="flex-1 py-3 rounded-xl text-white transition-all"
            style={{
              background: selectedTab === 'active' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className="flex-1 py-3 rounded-xl text-white transition-all"
            style={{
              background: selectedTab === 'completed' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedTab === 'active' && (
          <div className="space-y-4">
            {/* Active Order 1 - Grubhub */}
            <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: '#FDB515' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: '600' }}>
                    Grubhub
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Brown's Cafe
                  </h3>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#FDB515' }}>
                    $10
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Unit 3 Lobby
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    Pickup: 6:45 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Seller: Emma W.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl mb-4" style={{ background: '#DCFCE7' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#166534' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>
                    Request Accepted
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-2"
                  style={{ borderColor: '#E5E7EB', fontSize: '14px', fontWeight: '600' }}
                >
                  View Details
                </Button>
                <Button
                  onClick={() => onNavigate('rating')}
                  className="flex-1 h-11 rounded-xl text-white"
                  style={{ background: '#FDB515', fontSize: '14px', fontWeight: '600' }}
                >
                  Confirm Received
                </Button>
              </div>
            </div>

            {/* Active Order 2 - Dining */}
            <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: '#003262' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#DBEAFE', color: '#1E3A8A', fontSize: '12px', fontWeight: '600' }}>
                    Dining Hall
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Crossroads
                  </h3>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#003262' }}>
                    $8
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    6:30 PM – 8:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Seller: Taylor P.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl mb-4" style={{ background: '#FEF3C7' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: '#92400E' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#92400E' }}>
                    Pending Seller Response
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onNavigate('chat-dining')}
                  className="flex-1 py-3 rounded-xl border"
                  style={{ 
                    borderColor: '#003262',
                    background: 'white',
                    color: '#003262',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Message Seller
                </button>
                <button
                  className="flex-1 py-3 rounded-xl text-white"
                  style={{ 
                    background: '#10B981',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Confirm Pickup
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'completed' && (
          <div className="space-y-4">
            {/* Completed Order */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="px-3 py-1 rounded-full inline-block mb-2" style={{ background: '#DBEAFE', color: '#1E3A8A', fontSize: '12px', fontWeight: '600' }}>
                    Dining Hall
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Foothill
                  </h3>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#6B7280' }}>
                    $6
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Nov 16, 6:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Seller: Sarah M.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl" style={{ background: '#DCFCE7' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#166534' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}