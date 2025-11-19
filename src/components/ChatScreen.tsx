import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
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

  const quickReplies = [
    'Running 5 min late',
    'I\'m here!',
    'Where exactly?',
    'Thanks!'
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => onNavigate('orders-buyer')}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="#003262" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SJ</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>Sarah Johnson</Text>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate(orderType === 'dining' ? 'order-details-dining' : 'order-details-grubhub')}
            style={styles.infoButton}
          >
            <MaterialCommunityIcons name="information-outline" size={20} color="#003262" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>
              {orderType === 'dining' ? 'Crossroads Dining' : 'Brown\'s Cafe'}
            </Text>
            <View style={styles.bannerDetails}>
              <View style={styles.bannerDetail}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="#111827" />
                <Text style={styles.bannerDetailText}>6:30 - 7:00 PM</Text>
              </View>
              <View style={styles.bannerDetail}>
                <MaterialCommunityIcons name="map-marker-outline" size={12} color="#6B7280" />
                <Text style={[styles.bannerDetailText, styles.bannerDetailTextSecondary]}>Main Entrance</Text>
              </View>
            </View>
          </View>
          <Text style={styles.bannerPrice}>
            ${orderType === 'dining' ? '6' : '10'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {/* Date Separator */}
        <View style={styles.dateSeparator}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((message) => (
          <View 
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'me' ? styles.messageWrapperRight : styles.messageWrapperLeft
            ]}
          >
            <View 
              style={[
                styles.messageBubble,
                message.sender === 'me' ? styles.messageBubbleMe : styles.messageBubbleThem
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender === 'me' ? styles.messageTextMe : styles.messageTextThem
              ]}>
                {message.text}
              </Text>
            </View>
            <Text style={[
              styles.messageTime,
              message.sender === 'me' ? styles.messageTimeRight : styles.messageTimeLeft
            ]}>
              {message.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick Replies */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickRepliesContainer}
        contentContainerStyle={styles.quickRepliesContent}
      >
        {quickReplies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setInputText(reply)}
            style={styles.quickReplyButton}
          >
            <Text style={styles.quickReplyText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#003262',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#DBEAFE',
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003262',
    marginBottom: 4,
  },
  bannerDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  bannerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerDetailText: {
    fontSize: 11,
    color: '#111827',
  },
  bannerDetailTextSecondary: {
    color: '#6B7280',
  },
  bannerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003262',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    padding: 24,
    gap: 16,
  },
  dateSeparator: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  messageWrapper: {
    marginBottom: 8,
  },
  messageWrapperLeft: {
    alignItems: 'flex-start',
  },
  messageWrapperRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageBubbleMe: {
    backgroundColor: '#003262',
    borderBottomRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextThem: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  messageTimeLeft: {
    textAlign: 'left',
  },
  messageTimeRight: {
    textAlign: 'right',
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  quickRepliesContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  quickReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    maxHeight: 100,
    color: '#111827',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#003262',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
