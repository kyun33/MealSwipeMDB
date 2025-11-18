import { useState } from 'react';
import { BottomNav } from './BottomNav';
import { ChevronDown, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import type { Screen } from '../App';

interface CreateBuyerRequestProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateBuyerRequest({ onNavigate, activeTab, onTabChange }: CreateBuyerRequestProps) {
  const [requestType, setRequestType] = useState<'dining' | 'grubhub'>('dining');
  const [diningHall, setDiningHall] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [notes, setNotes] = useState('');

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return isSameDay(selectedDate, date);
  };

  const selectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Don't allow past dates
    
    setSelectedDate(date);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1" style={{ fontSize: '24px', fontWeight: '700' }}>
            Post Your Request
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setRequestType('dining')}
            className="flex-1 py-2 px-4 rounded-xl text-white"
            style={{ 
              background: requestType === 'dining' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)', 
              fontSize: '14px', 
              fontWeight: '600' 
            }}
          >
            Dining Hall
          </button>
          <button
            onClick={() => setRequestType('grubhub')}
            className="flex-1 py-2 px-4 rounded-xl text-white"
            style={{ 
              background: requestType === 'grubhub' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)', 
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
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-4 rounded-xl" style={{ background: '#DBEAFE' }}>
            <p style={{ fontSize: '13px', color: '#1E40AF', lineHeight: '1.5' }}>
              <span style={{ fontWeight: '600' }}>Post what you need!</span> Sellers will see your request and can accept it directly.
            </p>
          </div>

          {requestType === 'dining' ? (
            <>
              {/* Dining Hall Selector */}
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Dining Hall
                </label>
                <div className="relative">
                  <select
                    value={diningHall}
                    onChange={(e) => setDiningHall(e.target.value)}
                    className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-200 appearance-none bg-white"
                    style={{ fontSize: '16px', color: '#111827' }}
                  >
                    <option value="">Select dining hall</option>
                    <option value="foothill">Foothill</option>
                    <option value="cafe3">Cafe 3</option>
                    <option value="clarkkerr">Clark Kerr</option>
                    <option value="crossroads">Crossroads</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Restaurant Selector */}
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Restaurant
                </label>
                <div className="relative">
                  <select
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-200 appearance-none bg-white"
                    style={{ fontSize: '16px', color: '#111827' }}
                  >
                    <option value="">Select restaurant</option>
                    <option value="browns">Brown's Cafe</option>
                    <option value="ladle">Ladle and Leaf</option>
                    <option value="monsoon">Monsoon</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Pickup Location
                </label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  placeholder="e.g., Unit 3 Lobby"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </>
          )}

          {/* Calendar */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Select Date
            </label>
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: '#6B7280' }} />
                </button>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center py-2" style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF' }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = date < today;
                  const isSelected = isDateSelected(day);

                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && selectDate(day)}
                      disabled={isPast}
                      className="aspect-square rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: isSelected ? (requestType === 'dining' ? '#003262' : '#FDB515') : 'transparent',
                        color: isSelected ? '#FFFFFF' : isPast ? '#D1D5DB' : '#111827',
                        fontSize: '14px',
                        fontWeight: isSelected ? '600' : '500',
                        cursor: isPast ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedDate && (
              <p className="mt-2" style={{ fontSize: '12px', color: '#6B7280' }}>
                Selected: {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Time Window */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              {requestType === 'dining' ? 'Preferred Time Window' : 'Pickup Time'}
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  placeholder="Start time"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              {requestType === 'dining' && (
                <>
                  <div className="flex items-center justify-center px-2" style={{ color: '#9CA3AF' }}>
                    to
                  </div>
                  <div className="flex-1">
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-12 rounded-xl border-gray-200"
                      placeholder="End time"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Offer Price */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              What You're Offering to Pay
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ fontSize: '20px', fontWeight: '600', color: requestType === 'dining' ? '#003262' : '#FDB515' }}>
                $
              </span>
              <Input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="h-12 pl-8 rounded-xl border-gray-200"
                placeholder="0"
                style={{ fontSize: '16px' }}
              />
            </div>
            <p className="mt-1 text-gray-500" style={{ fontSize: '12px' }}>
              Typical range: {requestType === 'dining' ? '$5-$8' : '$8-$15'}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Additional Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 rounded-xl border-gray-200 resize-none"
              placeholder={requestType === 'dining' ? 'e.g., Can meet at main entrance' : 'e.g., Order must be under $12. I prefer vegetarian options.'}
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Post Button */}
          <Button
            className="w-full h-14 rounded-2xl text-white shadow-lg mt-8"
            style={{ 
              background: requestType === 'dining' 
                ? 'linear-gradient(135deg, #003262 0%, #004d8b 100%)'
                : 'linear-gradient(135deg, #FDB515 0%, #f4a700 100%)',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Post Request
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}