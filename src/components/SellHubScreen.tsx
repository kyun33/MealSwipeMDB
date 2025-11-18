import { BottomNav } from './BottomNav';
import { PlusCircle, Search, TrendingUp } from 'lucide-react';
import type { Screen } from '../App';

interface SellHubScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function SellHubScreen({ onNavigate, activeTab, onTabChange }: SellHubScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <h1 className="text-white mb-2" style={{ fontSize: '32px', fontWeight: '700' }}>
          Sell
        </h1>
        <p className="text-white/80" style={{ fontSize: '14px' }}>
          Choose how you want to sell your swipes
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Create Your Own Offer */}
          <button
            onClick={() => onNavigate('create-dining')}
            className="w-full bg-white rounded-3xl p-6 border-2 shadow-lg transition-all hover:shadow-xl"
            style={{ borderColor: '#003262' }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}
              >
                <PlusCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-1" style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                  Create Your Own Offer
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  Post your available swipes with your own schedule and pricing. Buyers will come to you.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: '#DBEAFE' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#1E3A8A' }}>
                        Dining Hall
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: '#FEF3C7' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#92400E' }}>
                        Grubhub
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Browse Buyer Requests */}
          <button
            onClick={() => onNavigate('buyer-requests')}
            className="w-full bg-white rounded-3xl p-6 border-2 shadow-lg transition-all hover:shadow-xl"
            style={{ borderColor: '#FDB515' }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FDB515 0%, #f4a700 100%)' }}
              >
                <Search className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                    Browse Buyer Requests
                  </h3>
                  <div 
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: '#FEE2E2' }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#DC2626' }}>
                      NEW
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  See requests from buyers looking for swipes. Accept the ones that fit your schedule.
                </p>
                <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg" style={{ background: '#FEF3C7' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#92400E' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#92400E' }}>
                    6 active requests right now
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#003262', marginBottom: '4px' }}>
                $5-8
              </div>
              <p style={{ fontSize: '12px', color: '#1E40AF' }}>
                Avg dining hall price
              </p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4">
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#FDB515', marginBottom: '4px' }}>
                $8-15
              </div>
              <p style={{ fontSize: '12px', color: '#92400E' }}>
                Avg Grubhub price
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-5 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
              Tips for Selling
            </h4>
            <div className="space-y-2">
              {[
                'Be flexible with timing to attract more buyers',
                'Respond quickly to messages and requests',
                'Clear meeting instructions increase success rate',
                'Higher ratings = more buyer interest'
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: '#FDB515' }}></div>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
