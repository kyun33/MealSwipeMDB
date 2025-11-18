import { BottomNav } from './BottomNav';
import { Star, Clock, MapPin, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

const diningHallListings = [
  {
    id: 1,
    name: 'Foothill',
    price: 6,
    rating: 4.8,
    timeWindow: '5:30–7:00 PM',
    sellerName: 'Sarah M.'
  },
  {
    id: 2,
    name: 'Cafe 3',
    price: 7,
    rating: 4.9,
    timeWindow: '6:00–8:00 PM',
    sellerName: 'Alex K.'
  },
  {
    id: 3,
    name: 'Clark Kerr',
    price: 6,
    rating: 4.7,
    timeWindow: '5:00–6:30 PM',
    sellerName: 'Jordan T.'
  },
  {
    id: 4,
    name: 'Crossroads',
    price: 8,
    rating: 5.0,
    timeWindow: '6:30–8:00 PM',
    sellerName: 'Taylor P.'
  },
];

const grubhubListings = [
  {
    id: 1,
    restaurant: 'Brown\'s Cafe',
    location: 'Unit 3 Lobby',
    price: 10,
    rating: 4.9,
    pickupTime: '6:45 PM',
    sellerName: 'Emma W.'
  },
  {
    id: 2,
    restaurant: 'Ladle and Leaf',
    location: 'Crossroads Entrance',
    price: 12,
    rating: 4.8,
    pickupTime: '7:15 PM',
    sellerName: 'Chris L.'
  },
  {
    id: 3,
    restaurant: 'Monsoon',
    location: 'Unit 1 Front Desk',
    price: 11,
    rating: 5.0,
    pickupTime: '6:30 PM',
    sellerName: 'Maya S.'
  },
];

export function HomeScreen({ onNavigate, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <h1 className="text-white mb-2" style={{ fontSize: '32px', fontWeight: '700' }}>
          Buy Swipes
        </h1>
        <p className="text-white/80" style={{ fontSize: '14px' }}>
          Find meal swipes from other Cal students
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Post Your Request CTA */}
        <div className="px-6 pt-6 pb-4">
          <button
            onClick={() => onNavigate('create-buyer-request')}
            className="w-full rounded-2xl p-4 border-2 border-dashed flex items-center gap-3 transition-all hover:bg-gray-50"
            style={{ borderColor: '#003262' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#003262' }}
            >
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#003262', marginBottom: '2px' }}>
                Can't find what you need?
              </h4>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Post your request and let sellers come to you
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#003262' }} />
          </button>
        </div>

        {/* Dining Hall Swipes Section */}
        <div className="px-6 py-4">
          <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937' }}>
            Dining Hall Swipe-ins
          </h2>
          
          <div className="space-y-3">
            {diningHallListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNavigate('order-details-dining')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                      {listing.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: '#FDB515' }} />
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>
                        {listing.rating}
                      </span>
                      <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                        • {listing.sellerName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#003262' }}>
                      ${listing.price}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    {listing.timeWindow}
                  </span>
                </div>

                <Button
                  className="w-full h-11 rounded-xl text-white"
                  style={{ background: '#003262', fontSize: '15px', fontWeight: '600' }}
                >
                  Request Swipe
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Grubhub Orders Section */}
        <div className="px-6 py-4 bg-white">
          <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937' }}>
            Grubhub Orders
          </h2>
          
          <div className="space-y-3">
            {grubhubListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onNavigate('order-details-grubhub')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                      {listing.restaurant}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: '#FDB515' }} />
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>
                        {listing.rating}
                      </span>
                      <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                        • {listing.sellerName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#003262' }}>
                      ${listing.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                      {listing.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#111827' }} />
                    <span style={{ fontSize: '14px', color: '#111827' }}>
                      Pickup: {listing.pickupTime}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-11 rounded-xl text-white"
                  style={{ background: '#FDB515', fontSize: '15px', fontWeight: '600' }}
                >
                  Request Order
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}