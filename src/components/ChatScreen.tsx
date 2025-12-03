import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getMessages, createMessage, getOrderById, getProfileById, markAllMessagesAsRead, completeOrder, markOrderAsReceived, auth } from '../services/api';
import { supabase } from '../services/supabase';
import type { Screen } from '../App';
import type { Message as APIMessage, Order } from '../services/api';

interface ChatScreenProps {
  onNavigate: (screen: Screen, orderId?: string) => void;
  orderId?: string;
  orderType?: 'dining' | 'grubhub';
}

export function ChatScreen({ onNavigate, orderId, orderType = 'dining' }: ChatScreenProps) {
  const [messages, setMessages] = useState<APIMessage[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [otherUser, setOtherUser] = useState<{ name: string; initials: string } | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [markingReceived, setMarkingReceived] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (orderId) {
      loadChatData();
    }
  }, [orderId]);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Set up Supabase Realtime subscription for messages
  useEffect(() => {
    if (!orderId || !currentUserId) return;

    // Subscribe to changes in the messages table for this order
    const channel = supabase
      .channel(`messages:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // New message received
            const newMessage = payload.new as APIMessage;

            // Process image URL if present
            const processedMessage = await processMessageImageUrl(newMessage);

            // Add new message to state (avoid duplicates)
            setMessages((prevMessages) => {
              const exists = prevMessages.some((msg) => msg.id === processedMessage.id);
              if (exists) {
                return prevMessages;
              }
              return [...prevMessages, processedMessage].sort(
                (a, b) =>
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });

            // Mark as read if we're the receiver
            if (newMessage.receiver_id === currentUserId && !newMessage.is_read) {
              try {
                await markAllMessagesAsRead(orderId, currentUserId);
              } catch (error) {
                console.error('Error marking message as read:', error);
              }
            }
          } else if (payload.eventType === 'UPDATE') {
            // Message updated (e.g., marked as read)
            const updatedMessage = payload.new as APIMessage;

            const processedMessage = await processMessageImageUrl(updatedMessage);

            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === processedMessage.id ? processedMessage : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Message deleted
            const deletedMessage = payload.old as APIMessage;
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.id !== deletedMessage.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup: unsubscribe when component unmounts or dependencies change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, currentUserId]);

  // Realtime subscription for order status updates (confirmation & reception)
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrder((prev) => {
            // If we already have this order in state, update it; otherwise just set it
            if (prev && prev.id === updatedOrder.id) {
              return updatedOrder;
            }
            return updatedOrder;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Helper function to process signed URLs for messages with images
  const processMessageImageUrl = async (message: APIMessage): Promise<APIMessage> => {
    if (!message.image_url) return message;

    try {
      // Extract the file path from the URL
      // Public URLs look like: https://[project].supabase.co/storage/v1/object/public/chat-images/[path]
      // We need to extract the path after 'chat-images/'
      const urlParts = message.image_url.split('/chat-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        // Create a signed URL that expires in 1 hour
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('chat-images')
          .createSignedUrl(filePath, 3600); // 1 hour expiry

        if (!signedUrlError && signedUrlData) {
          return { ...message, image_url: signedUrlData.signedUrl };
        }
      }
    } catch (error) {
      console.error('Error creating signed URL:', error);
      // Fall back to original URL
    }

    return message;
  };

  const loadChatData = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const user = await auth.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in to view messages');
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      // Load order and messages
      const [orderData, messagesData] = await Promise.all([
        getOrderById(orderId),
        getMessages(orderId)
      ]);

      if (!orderData) {
        Alert.alert('Error', 'Order not found');
        return;
      }

      setOrder(orderData);

      // Generate signed URLs for images if the bucket is private
      const messagesWithSignedUrls = await Promise.all(
        messagesData.map(processMessageImageUrl)
      );

      setMessages(messagesWithSignedUrls);

      // Load other user's profile
      const otherUserId = orderData.buyer_id === user.id ? orderData.seller_id : orderData.buyer_id;
      const otherUserProfile = await getProfileById(otherUserId);
      if (otherUserProfile) {
        const nameParts = otherUserProfile.full_name.split(' ');
        setOtherUser({
          name: otherUserProfile.full_name,
          initials: (nameParts[0][0] + (nameParts[1]?.[0] || '')).toUpperCase()
        });
      }

      // Mark messages as read
      await markAllMessagesAsRead(orderId, user.id);
    } catch (error) {
      console.error('Error loading chat:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to send images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (imageUri: string): Promise<string> => {
    if (!orderId || !currentUserId) {
      throw new Error('Missing order ID or user ID');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${orderId}/${currentUserId}_${timestamp}_${randomString}.jpg`;

    // For React Native, we need to use FormData with the file
    // Extract the filename from the URI
    const uriParts = imageUri.split('/');
    const imageName = uriParts[uriParts.length - 1] || 'image.jpg';
    
    // Create FormData with React Native file format
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageName,
    } as any);

    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Upload using Supabase storage REST API
    // The endpoint format: POST /storage/v1/object/{bucket}/{path}
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const uploadUrl = `${supabaseUrl}/storage/v1/object/chat-images/${filename}`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        // Don't set Content-Type - let FormData set it with boundary
      },
      body: formData as any,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Upload failed' };
      }
      throw new Error(errorData.message || errorData.error || 'Failed to upload image');
    }

    // Get public URL (if bucket is public) or create signed URL (if bucket is private)
    // First try public URL
    const { data: urlData } = supabase.storage
      .from('chat-images')
      .getPublicUrl(filename);

    // If bucket is private, we need to create a signed URL
    // For now, return the public URL - if it doesn't work, the bucket needs to be public
    // OR we need to generate signed URLs when loading messages
    return urlData.publicUrl;
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || !orderId || !currentUserId || !order) return;

    try {
      setSending(true);
      setUploadingImage(!!selectedImage);
      const otherUserId = order.buyer_id === currentUserId ? order.seller_id : order.buyer_id;
      
      let imageUrl: string | undefined;
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          setSending(false);
          setUploadingImage(false);
          return;
        }
      }

      // Create message and add it optimistically
      const newMessage = await createMessage({
        order_id: orderId,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message_text: inputText.trim() || (imageUrl ? '📷 Image' : ''),
        image_url: imageUrl
      });

      // Process image URL if present
      const processedMessage = await processMessageImageUrl(newMessage);

      // Add message immediately for instant feedback (Realtime will also receive it, but duplicate check prevents duplicates)
      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg.id === processedMessage.id);
        if (exists) {
          return prevMessages;
        }
        return [...prevMessages, processedMessage].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      // Clear input
      setInputText('');
      setSelectedImage(null);
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
      setUploadingImage(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId || !order || !currentUserId) return;

    Alert.alert(
      'Complete Order',
      'Are you sure you want to mark this order as completed? The buyer will need to confirm receipt.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: async () => {
            try {
              setCompleting(true);
              const updatedOrder = await completeOrder(orderId);
              setOrder(updatedOrder);
              
              Alert.alert('Success', 'Order marked as completed! Waiting for buyer confirmation.');
            } catch (error: any) {
              console.error('Error completing order:', error);
              Alert.alert('Error', error.message || 'Failed to complete order. Please try again.');
            } finally {
              setCompleting(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsReceived = async () => {
    if (!orderId || !order || !currentUserId) return;

    Alert.alert(
      'Mark as Received',
      'Have you received your order? This will close the order and allow you to rate your experience.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Received',
          style: 'default',
          onPress: async () => {
            try {
              setMarkingReceived(true);
              const updatedOrder = await markOrderAsReceived(orderId);
              setOrder(updatedOrder);
              
              Alert.alert(
                'Success',
                'Order marked as received! Would you like to rate your experience?',
                [
                  { text: 'Later', style: 'cancel' },
                  {
                    text: 'Rate Now',
                    onPress: () => {
                      onNavigate('rating', orderId);
                    }
                  }
                ]
              );
            } catch (error: any) {
              console.error('Error marking order as received:', error);
              Alert.alert('Error', error.message || 'Failed to mark order as received. Please try again.');
            } finally {
              setMarkingReceived(false);
            }
          }
        }
      ]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getOrderName = (order: Order) => {
    if (order.item_type === 'dining') {
      const diningHallNames: Record<string, string> = {
        foothill: 'Foothill',
        cafe3: 'Cafe 3',
        clarkkerr: 'Clark Kerr',
        crossroads: 'Crossroads'
      };
      return diningHallNames[order.dining_hall!] || order.dining_hall || 'Dining Hall';
    } else {
      const restaurantNames: Record<string, string> = {
        browns: 'Brown\'s Cafe',
        ladle: 'Ladle and Leaf',
        monsoon: 'Monsoon'
      };
      return restaurantNames[order.restaurant!] || order.restaurant || 'Restaurant';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  if (!order || !otherUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>No chat available</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => onNavigate(currentUserId === order?.buyer_id ? 'orders-buyer' : 'orders-seller')}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="#003262" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{otherUser.initials}</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>{otherUser.name}</Text>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate(order.item_type === 'dining' ? 'order-details-dining' : 'order-details-grubhub', orderId)}
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
            <Text style={styles.bannerTitle}>{getOrderName(order)}</Text>
            <View style={styles.bannerDetails}>
              <View style={styles.bannerDetail}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="#111827" />
                <Text style={styles.bannerDetailText}>
                  {order.pickup_time_start.substring(0, 5)}
                  {order.pickup_time_end ? ` - ${order.pickup_time_end.substring(0, 5)}` : ''}
                </Text>
              </View>
              {order.pickup_location && !(order.item_type === 'grubhub' && currentUserId === order.seller_id) && (
                <View style={styles.bannerDetail}>
                  <MaterialCommunityIcons name="map-marker-outline" size={12} color="#6B7280" />
                  <Text style={[styles.bannerDetailText, styles.bannerDetailTextSecondary]}>
                    {order.pickup_location}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.bannerPrice}>${Number(order.price)}</Text>
        </View>
      </View>

      {/* Complete Order Button - Only for sellers when order is confirmed */}
      {currentUserId && order && currentUserId === order.seller_id && order.status === 'confirmed' && (
        <View style={styles.completeOrderContainer}>
          <TouchableOpacity
            onPress={handleCompleteOrder}
            disabled={completing}
            style={[styles.completeOrderButton, completing && styles.completeOrderButtonDisabled]}
          >
            {completing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.completeOrderText}>Complete Order</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Mark as Received Button - Only for buyers when order is completed */}
      {currentUserId && order && currentUserId === order.buyer_id && order.status === 'completed' && (
        <View style={styles.completeOrderContainer}>
          <TouchableOpacity
            onPress={handleMarkAsReceived}
            disabled={markingReceived}
            style={[styles.completeOrderButton, markingReceived && styles.completeOrderButtonDisabled]}
          >
            {markingReceived ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="package-variant" size={20} color="#FFFFFF" />
                <Text style={styles.completeOrderText}>Mark as Received</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Rate Order Button - For both buyer and seller when order is delivered */}
      {currentUserId && order && order.status === 'delivered' && (
        <View style={styles.completeOrderContainer}>
          <TouchableOpacity
            onPress={() => onNavigate('rating', orderId)}
            style={[styles.completeOrderButton, { backgroundColor: '#FDB515' }]}
          >
            <MaterialCommunityIcons name="star" size={20} color="#FFFFFF" />
            <Text style={styles.completeOrderText}>Rate Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length > 0 && (
          <View style={styles.dateSeparator}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{formatDate(messages[0].created_at)}</Text>
            </View>
          </View>
        )}

        {messages.map((message) => {
          const isMe = message.sender_id === currentUserId;
          return (
            <View 
              key={message.id}
              style={[
                styles.messageWrapper,
                isMe ? styles.messageWrapperRight : styles.messageWrapperLeft
              ]}
            >
              <View 
                style={[
                  styles.messageBubble,
                  isMe ? styles.messageBubbleMe : styles.messageBubbleThem
                ]}
              >
                {message.image_url && (
                  <Image 
                    source={{ uri: message.image_url }} 
                    style={styles.messageImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.error('Error loading image:', error.nativeEvent.error, message.image_url);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', message.image_url);
                    }}
                  />
                )}
                {message.message_text && (
                  <Text style={[
                    styles.messageText,
                    isMe ? styles.messageTextMe : styles.messageTextThem,
                    message.image_url && styles.messageTextWithImage
                  ]}>
                    {message.message_text}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.messageTime,
                isMe ? styles.messageTimeRight : styles.messageTimeLeft
              ]}>
                {formatTime(message.created_at)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Selected Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageButton}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handlePickImage}
          style={styles.imageButton}
          disabled={sending || uploadingImage}
        >
          <MaterialCommunityIcons 
            name="image-outline" 
            size={24} 
            color={sending || uploadingImage ? "#9CA3AF" : "#003262"} 
          />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={selectedImage ? "Add a caption (optional)..." : "Type a message..."}
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
            multiline
            maxLength={500}
            editable={!sending && !uploadingImage}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || sending || uploadingImage}
            style={[
              styles.sendButton,
              ((!inputText.trim() && !selectedImage) || sending || uploadingImage) && styles.sendButtonDisabled
            ]}
          >
            {(sending || uploadingImage) ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={(inputText.trim() || selectedImage) ? "#FFFFFF" : "#9CA3AF"} 
              />
            )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  completeOrderContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  completeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  completeOrderButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  completeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  messageTextWithImage: {
    marginTop: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 0,
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
  imagePreviewContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    padding: 4,
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  imageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
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
