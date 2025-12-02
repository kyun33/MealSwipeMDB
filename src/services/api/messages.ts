import { supabase } from '../supabase';

export interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateMessageData {
  order_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  image_url?: string;
}

// GET /messages - Get messages for an order
export const getMessages = async (orderId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

// GET /messages/unread - Get unread messages for current user
export const getUnreadMessages = async (userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('receiver_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// POST /messages - Create new message
export const createMessage = async (messageData: CreateMessageData): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /messages/:id/read - Mark message as read
export const markMessageAsRead = async (id: string): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /messages/read-all - Mark all messages in an order as read
export const markAllMessagesAsRead = async (orderId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('order_id', orderId)
    .eq('receiver_id', userId)
    .eq('is_read', false);
  
  if (error) throw error;
};

