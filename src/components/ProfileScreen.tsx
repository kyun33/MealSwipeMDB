import { BottomNav } from './BottomNav';
import { Star, CreditCard, History, HelpCircle, LogOut, ChevronRight, Edit } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function ProfileScreen({ onNavigate, activeTab, onTabChange }: ProfileScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-8" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <h1 className="text-white mb-6" style={{ fontSize: '28px', fontWeight: '700' }}>
          Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#003262' }}>
                <span className="text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                  JD
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-lg">
                <Edit className="w-4 h-4" style={{ color: '#003262' }} />
              </button>
            </div>
            <div className="flex-1">
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827' }}>
                John Doe
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                john.doe@berkeley.edu
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl" style={{ background: '#F9FAFB' }}>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-6 h-6 fill-current" 
                  style={{ color: '#FDB515' }} 
                />
              ))}
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginLeft: '4px' }}>
              4.9
            </span>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              (32 reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#003262' }}>
              12
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
              Completed Sales
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#FDB515' }}>
              18
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
              Purchases Made
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {/* Payment Settings */}
          <button className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#DBEAFE' }}>
              <CreditCard className="w-6 h-6" style={{ color: '#003262' }} />
            </div>
            <div className="flex-1 text-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Payment Settings
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                Manage payment methods
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#9CA3AF' }} />
          </button>

          {/* Order History */}
          <button 
            onClick={() => onNavigate('orders-buyer')}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <History className="w-6 h-6" style={{ color: '#FDB515' }} />
            </div>
            <div className="flex-1 text-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Order History
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                View all transactions
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#9CA3AF' }} />
          </button>

          {/* Help & Support */}
          <button className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#DCFCE7' }}>
              <HelpCircle className="w-6 h-6" style={{ color: '#059669' }} />
            </div>
            <div className="flex-1 text-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Help & Support
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                FAQs and contact us
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#9CA3AF' }} />
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button
            onClick={() => onNavigate('onboarding')}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 flex items-center justify-center gap-2"
            style={{ 
              borderColor: '#FCA5A5',
              color: '#DC2626',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center mt-8 mb-4">
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Cal Meal Share v1.0.0
          </p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
            Made for UC Berkeley students
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
