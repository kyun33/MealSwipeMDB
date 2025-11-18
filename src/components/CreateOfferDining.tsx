import { useState } from 'react';
import { BottomNav } from './BottomNav';
import { ChevronDown, ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import type { Screen } from '../App';

interface CreateOfferDiningProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateOfferDining({ onNavigate, activeTab, onTabChange }: CreateOfferDiningProps) {
  const [diningHall, setDiningHall] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
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
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return selectedDates.some(selectedDate => isSameDay(selectedDate, date));
  };

  const toggleDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Don't allow past dates
    
    if (isDateSelected(day)) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
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
            Sell Dining Hall Swipe
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 px-4 rounded-xl text-white"
            style={{ background: 'rgba(255, 255, 255, 0.3)', fontSize: '14px', fontWeight: '600' }}
          >
            Dining Hall
          </button>
          <button
            onClick={() => onNavigate('create-grubhub')}
            className="flex-1 py-2 px-4 rounded-xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: '600' }}
          >
            Grubhub
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
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

          {/* Calendar */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Select Dates
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
                      onClick={() => !isPast && toggleDate(day)}
                      disabled={isPast}
                      className="aspect-square rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: isSelected ? '#003262' : 'transparent',
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
            {selectedDates.length > 0 && (
              <p className="mt-2" style={{ fontSize: '12px', color: '#6B7280' }}>
                {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Time Window */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Available Time Window
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
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ fontSize: '20px', fontWeight: '600', color: '#003262' }}>
                $
              </span>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 pl-8 rounded-xl border-gray-200"
                placeholder="0"
                style={{ fontSize: '16px' }}
              />
            </div>
            <p className="mt-1 text-gray-500" style={{ fontSize: '12px' }}>
              Typical range: $5-$8
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 rounded-xl border-gray-200 resize-none"
              placeholder="e.g., Meet at main entrance"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Post Button */}
          <Button
            className="w-full h-14 rounded-2xl text-white shadow-lg mt-8"
            style={{ 
              background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Post Offer
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}