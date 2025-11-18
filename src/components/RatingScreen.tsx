import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import type { Screen } from '../App';

interface RatingScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function RatingScreen({ onNavigate }: RatingScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)' }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('orders-buyer')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1" style={{ fontSize: '24px', fontWeight: '700' }}>
            Rate Experience
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Seller Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: '#FDB515' }}>
            <span className="text-white" style={{ fontSize: '36px', fontWeight: '600' }}>
              EW
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            Emma W.
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
            Brown's Cafe • Grubhub Order
          </p>
        </div>

        {/* Rating Section */}
        <div className="mb-8">
          <h3 className="text-center mb-4" style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            How was your experience?
          </h3>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="w-12 h-12 fill-current transition-colors"
                  style={{
                    color: star <= (hoverRating || rating) ? '#FDB515' : '#E5E7EB'
                  }}
                />
              </button>
            ))}
          </div>

          <p className="text-center" style={{ fontSize: '14px', color: '#6B7280' }}>
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Add a comment (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-32 rounded-xl border-gray-200 resize-none"
            placeholder="Share details of your experience..."
            style={{ fontSize: '16px' }}
          />
          <p className="mt-2 text-gray-500" style={{ fontSize: '12px' }}>
            Your feedback helps the community
          </p>
        </div>

        {/* Quick Tags */}
        <div className="mb-8">
          <p className="mb-3" style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>
            Quick tags (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {['On time', 'Friendly', 'Great communication', 'Easy meetup', 'Would buy again'].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full border-2 transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  background: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={() => onNavigate('orders-buyer')}
          disabled={rating === 0}
          className="w-full h-14 rounded-2xl text-white shadow-lg disabled:opacity-50"
          style={{ 
            background: rating === 0 
              ? '#9CA3AF' 
              : 'linear-gradient(135deg, #003262 0%, #004d8b 100%)',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Submit Rating
        </Button>
      </div>
    </div>
  );
}