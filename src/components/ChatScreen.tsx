import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Clock, MapPin, Info } from 'lucide-react';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface ChatScreenProps {
  onNavigate: (screen: Screen) => void;
  orderType?: 'dining' | 'grubhub';
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

export function ChatScreen({ onNavigate, orderType = 'dining' }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi! I just bought your meal swipe.',
      sender: 'me',
      time: '2:15 PM'
    },
    {
      id: 2,
      text: 'Great! I\'ll be at the dining hall entrance at 6:30.',
      sender: 'them',
      time: '2:16 PM'
    },
    {
      id: 3,
      text: 'Perfect! See you then.',
      sender: 'me',
      time: '2:17 PM'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'Running 5 min late',
    'I\'m here!',
    'Where exactly?',
    'Thanks!'
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <button 
            onClick={() => onNavigate('orders-buyer')}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#003262' }} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#003262' }}>
                <span className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>
                  SJ
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  Sarah Johnson
                </h2>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }}></div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Online</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate(orderType === 'dining' ? 'order-details-dining' : 'order-details-grubhub')}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Info className="w-5 h-5" style={{ color: '#003262' }} />
          </button>
        </div>
      </div>

      {/* Order Summary Banner */}
      <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#003262', marginBottom: '2px' }}>
              {orderType === 'dining' ? 'Crossroads Dining' : 'Brown\'s Cafe'}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" style={{ color: '#111827' }} />
                <span style={{ fontSize: '11px', color: '#111827' }}>6:30 - 7:00 PM</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Main Entrance</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#003262' }}>
            ${orderType === 'dining' ? '6' : '10'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="space-y-4">
          {/* Date Separator */}
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 rounded-full" style={{ background: '#E5E7EB' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280' }}>
                Today
              </span>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}
              >
                <div 
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    background: message.sender === 'me' ? '#003262' : '#FFFFFF',
                    color: message.sender === 'me' ? '#FFFFFF' : '#111827',
                    borderBottomRightRadius: message.sender === 'me' ? '4px' : '16px',
                    borderBottomLeftRadius: message.sender === 'them' ? '4px' : '16px',
                    boxShadow: message.sender === 'them' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                    {message.text}
                  </p>
                </div>
                <p 
                  className={`mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}
                  style={{ fontSize: '11px', color: '#9CA3AF' }}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="px-6 py-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setInputText(reply)}
              className="px-4 py-2 rounded-full whitespace-nowrap border"
              style={{ 
                borderColor: '#E5E7EB',
                background: '#F9FAFB',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 resize-none"
              style={{ 
                fontSize: '15px',
                maxHeight: '100px',
                outline: 'none'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 100) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50"
            style={{ 
              background: inputText.trim() 
                ? 'linear-gradient(135deg, #003262 0%, #004d8b 100%)'
                : '#D1D5DB'
            }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}