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
  const status = orderData.status || 'confirmed';
  
  console.log('Creating order with data:', { ...orderData, status });
  
  // Skip RPC for now - Supabase RPC has issues with return types
  // Use direct insert + query method which is more reliable
  // TODO: Re-enable RPC once Supabase RPC return type issues are resolved
  
  // Fallback: Direct insert without SELECT, then query for it
  // This avoids RLS issues with SELECT after INSERT
  const orderWithStatus = {
    ...orderData,
    status
  };
  
  console.log('Inserting order (fallback method)...');
  
  // Insert without SELECT to avoid RLS blocking
  const { error: insertError } = await supabase
    .from('orders')
    .insert(orderWithStatus);
  
  if (insertError) {
    console.error('Insert error:', insertError);
    throw insertError;
  }
  
  console.log('Order inserted, querying for it...');
  
  // Wait a brief moment for the insert to complete
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Now query for the order we just created
  // Query by unique combination of fields to find the order
  let query = supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', orderData.buyer_id)
    .eq('seller_id', orderData.seller_id)
    .eq('order_type', orderData.order_type)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(1);
  
  // Add offer/request ID filter if present
  if (orderData.dining_offer_id) {
    query = query.eq('dining_offer_id', orderData.dining_offer_id);
  } else if (orderData.grubhub_offer_id) {
    query = query.eq('grubhub_offer_id', orderData.grubhub_offer_id);
  } else if (orderData.buyer_request_id) {
    query = query.eq('buyer_request_id', orderData.buyer_request_id);
  }
  
  const { data: queryData, error: queryError } = await query;
  
  if (queryError) {
    console.error('Query error:', queryError);
    throw new Error(`Order was created but could not be retrieved: ${queryError.message}`);
  }
  
  if (!queryData || queryData.length === 0) {
    console.error('No order found after insert. Query params:', {
      buyer_id: orderData.buyer_id,
      seller_id: orderData.seller_id,
      order_type: orderData.order_type,
      status
    });
    throw new Error('Order was created but could not be retrieved. Please refresh and check your orders.');
  }
  
  console.log('Order retrieved successfully:', queryData[0].id);
  return queryData[0];
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

