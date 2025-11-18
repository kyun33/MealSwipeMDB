import { useState } from 'react';
import { BottomNav } from './BottomNav';
import { Clock, MapPin, User, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface BuyerRequestsScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function BuyerRequestsScreen({ onNavigate, activeTab, onTabChange }: BuyerRequestsScreenProps) {
  const [filterType, setFilterType] = useState<'all' | 'dining' | 'grubhub'>('all');

  const buyerRequests = [
    {
      id: 1,
      type: 'dining',
      buyerName: 'Alex T.',
      buyerRating: 4.9,
      diningHall: 'Crossroads',
      date: 'Today',
      timeWindow: '6:00 PM - 7:30 PM',
      offerPrice: 7,
      notes: 'Need swipe for dinner. Can meet at main entrance.'
    },
    {
      id: 2,
      type: 'grubhub',
      buyerName: 'Sophie K.',
      buyerRating: 5.0,
      restaurant: 'Brown\'s Cafe',
      location: 'Unit 2 Lobby',
      date: 'Tomorrow',
      pickupTime: '7:00 PM',
      offerPrice: 11,
      notes: 'Order under $12. Vegetarian options preferred.'
    },
    {
      id: 3,
      type: 'dining',
      buyerName: 'Marcus L.',
      buyerRating: 4.7,
      diningHall: 'Foothill',
      date: 'Today',
      timeWindow: '5:30 PM - 6:30 PM',
      offerPrice: 6,
      notes: 'Looking for early dinner swipe.'
    },
    {
      id: 4,
      type: 'grubhub',
      buyerName: 'Emma R.',
      buyerRating: 4.8,
      restaurant: 'Monsoon',
      location: 'Unit 3 Front Desk',
      date: 'Nov 20',
      pickupTime: '6:45 PM',
      offerPrice: 12,
      notes: 'Will order by 6:30 PM. Max $13.'
    },
    {
      id: 5,
      type: 'dining',
      buyerName: 'David P.',
      buyerRating: 5.0,
      diningHall: 'Cafe 3',
      date: 'Tomorrow',
      timeWindow: '12:00 PM - 1:00 PM',
      offerPrice: 6,
      notes: 'Need lunch swipe. Meet at side entrance.'
    },
    {
      id: 6,
      type: 'grubhub',
      buyerName: 'Olivia M.',
      buyerRating: 4.6,
      restaurant: 'Ladle and Leaf',
      location: 'Crossroads Entrance',
      date: 'Today',
      pickupTime: '7:30 PM',
      offerPrice: 10,
      notes: 'Looking for healthy options. Order by 7 PM.'
    }
  ];

  const filteredRequests = filterType === 'all' 
    ? buyerRequests 
    : buyerRequests.filter(req => req.type === filterType);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: '700' }}>
          Buyer Requests
        </h1>
        <p className="text-white/80 mb-4" style={{ fontSize: '14px' }}>
          Accept requests from buyers looking for swipes
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className="px-4 py-2 rounded-xl"
            style={{ 
              background: filterType === 'all' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('dining')}
            className="px-4 py-2 rounded-xl"
            style={{ 
              background: filterType === 'dining' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Dining Hall
          </button>
          <button
            onClick={() => setFilterType('grubhub')}
            className="px-4 py-2 rounded-xl"
            style={{ 
              background: filterType === 'grubhub' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Grubhub
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-2xl p-5 border-2 shadow-sm"
              style={{ borderColor: request.type === 'dining' ? '#003262' : '#FDB515' }}
            >
              {/* Buyer Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: request.type === 'dining' ? '#003262' : '#FDB515' }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                      {request.buyerName}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className="w-3.5 h-3.5" 
                            fill={i < Math.floor(request.buyerRating) ? '#FDB515' : '#E5E7EB'}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '4px' }}>
                        {request.buyerRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="px-3 py-1 rounded-full mb-1"
                    style={{ 
                      background: request.type === 'dining' ? '#DBEAFE' : '#FEF3C7',
                      color: request.type === 'dining' ? '#1E3A8A' : '#92400E',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    {request.type === 'dining' ? 'Dining Hall' : 'Grubhub'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {request.date}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-4">
                <h4 className="mb-2" style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  {request.type === 'dining' ? request.diningHall : request.restaurant}
                </h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                    <span style={{ fontSize: '14px', color: '#111827' }}>
                      {request.type === 'dining' ? request.timeWindow : `Pickup: ${request.pickupTime}`}
                    </span>
                  </div>
                  {request.type === 'grubhub' && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>
                        {request.location}
                      </span>
                    </div>
                  )}
                  {request.notes && (
                    <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', fontStyle: 'italic' }}>
                      "{request.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-1">
                  <DollarSign 
                    className="w-5 h-5" 
                    style={{ color: request.type === 'dining' ? '#003262' : '#FDB515' }} 
                  />
                  <div>
                    <span style={{ fontSize: '11px', color: '#6B7280', display: 'block' }}>
                      Buyer is offering
                    </span>
                    <span 
                      style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: request.type === 'dining' ? '#003262' : '#FDB515' 
                      }}
                    >
                      ${request.offerPrice}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => onNavigate('orders-seller')}
                  className="h-12 px-6 rounded-xl text-white shadow-lg"
                  style={{ 
                    background: request.type === 'dining'
                      ? 'linear-gradient(135deg, #003262 0%, #004d8b 100%)'
                      : 'linear-gradient(135deg, #FDB515 0%, #f4a700 100%)',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  Accept Request
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}