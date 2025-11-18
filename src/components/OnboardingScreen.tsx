import { Button } from './ui/button';
import { UtensilsCrossed, GraduationCap } from 'lucide-react';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(135deg, #003262 0%, #003262 50%, #FDB515 100%)' }}>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        {/* Logo/Icon */}
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="w-8 h-8" style={{ color: '#003262' }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-center mb-4" style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Cal Meal Share
        </h1>
        
        <p className="text-white/90 text-center mb-2" style={{ fontSize: '18px' }}>
          Buy & Sell Meal Swipes
        </p>
        
        <p className="text-white/70 text-center mb-12" style={{ fontSize: '14px', maxWidth: '280px' }}>
          The marketplace for UC Berkeley students to trade dining hall swipes and Grubhub orders
        </p>

        {/* Illustration */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <span style={{ fontSize: '36px' }}>🍔</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-8 bg-white rounded-t-3xl">
        <Button 
          onClick={onGetStarted}
          className="w-full h-14 rounded-2xl text-white shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #003262 0%, #004d8b 100%)',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Sign in with Berkeley Email
        </Button>
        
        <p className="text-center mt-4 text-gray-500" style={{ fontSize: '12px' }}>
          @berkeley.edu email required
        </p>
      </div>
    </div>
  );
}
