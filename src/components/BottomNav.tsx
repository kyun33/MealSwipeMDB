import { ShoppingBag, PlusCircle, Receipt, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'buy' as const, icon: ShoppingBag, label: 'Buy' },
    { id: 'sell' as const, icon: PlusCircle, label: 'Sell' },
    { id: 'orders' as const, icon: Receipt, label: 'Orders' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
              style={{
                color: isActive ? '#003262' : '#9CA3AF',
              }}
            >
              <Icon 
                className="w-6 h-6" 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span style={{ 
                fontSize: '11px',
                fontWeight: isActive ? '600' : '500'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
