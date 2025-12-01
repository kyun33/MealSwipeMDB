import { supabase } from '../supabase';

export interface Order {
  id: string;
  order_type: 'dining_offer' | 'grubhub_offer' | 'buyer_request';
  dining_offer_id?: string;
  grubhub_offer_id?: string;
  buyer_request_id?: string;
  buyer_id: string;
  seller_id: string;
  item_type: 'dining' | 'grubhub';
  dining_hall?: string;
  restaurant?: string;
  pickup_location?: string;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end?: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'delivered' | 'cancelled';
  buyer_rated: boolean;
  seller_rated: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  order_type: 'dining_offer' | 'grubhub_offer' | 'buyer_request';
  dining_offer_id?: string;
  grubhub_offer_id?: string;
  buyer_request_id?: string;
  buyer_id: string;
  seller_id: string;
  item_type: 'dining' | 'grubhub';
  dining_hall?: string;
  restaurant?: string;
  pickup_location?: string;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end?: string;
  price: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'delivered' | 'cancelled';
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'completed' | 'delivered' | 'cancelled';
  buyer_rated?: boolean;
  seller_rated?: boolean;
}

// GET /orders - Get orders (filtered by user role)
export const getOrders = async (filters?: {
  buyer_id?: string;
  seller_id?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'delivered' | 'cancelled';
  item_type?: 'dining' | 'grubhub';
  date_from?: string;
  date_to?: string;
}): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select('*');
  
  if (filters?.buyer_id) {
    query = query.eq('buyer_id', filters.buyer_id);
  }
  if (filters?.seller_id) {
    query = query.eq('seller_id', filters.seller_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.item_type) {
    query = query.eq('item_type', filters.item_type);
  }
  if (filters?.date_from) {
    query = query.gte('pickup_date', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('pickup_date', filters.date_to);
  }
  
  query = query.order('pickup_date', { ascending: false })
    .order('created_at', { ascending: false });
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// GET /orders/:id - Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// POST /orders - Create new order
// Orders are automatically confirmed when created (buyer accepts offer or seller accepts request)
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  // Automatically set status to 'confirmed' if not explicitly provided
  const orderWithStatus = {
    ...orderData,
    status: orderData.status || 'confirmed'
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(orderWithStatus)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /orders/:id - Update order
export const updateOrder = async (id: string, updates: UpdateOrderData): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// POST /orders/:id/confirm - Confirm an order
export const confirmOrder = async (id: string): Promise<Order> => {
  return updateOrder(id, { status: 'confirmed' });
};

// POST /orders/:id/complete - Complete an order (seller marks as completed)
export const completeOrder = async (id: string): Promise<Order> => {
  return updateOrder(id, { status: 'completed' });
};

// POST /orders/:id/receive - Mark order as received (buyer marks as received)
export const markOrderAsReceived = async (id: string): Promise<Order> => {
  return updateOrder(id, { status: 'delivered' });
};

// POST /orders/:id/cancel - Cancel an order
export const cancelOrder = async (id: string): Promise<Order> => {
  return updateOrder(id, { status: 'cancelled' });
};

