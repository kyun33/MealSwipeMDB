import { supabase } from '../supabase';

export interface BuyerRequest {
  id: string;
  buyer_id: string;
  request_type: 'dining' | 'grubhub';
  dining_hall?: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  restaurant?: 'browns' | 'ladle' | 'monsoon' | 'goldenbear';
  pickup_location?: string;
  request_date: string;
  start_time: string;
  end_time?: string;
  offer_price: number;
  notes?: string;
  status: 'active' | 'accepted' | 'completed' | 'cancelled';
  accepted_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBuyerRequestData {
  buyer_id: string;
  request_type: 'dining' | 'grubhub';
  dining_hall?: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  restaurant?: 'browns' | 'ladle' | 'monsoon' | 'goldenbear';
  pickup_location?: string;
  request_date: string;
  start_time: string;
  end_time?: string;
  offer_price: number;
  notes?: string;
}

export interface UpdateBuyerRequestData {
  dining_hall?: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  restaurant?: 'browns' | 'ladle' | 'monsoon' | 'goldenbear';
  pickup_location?: string;
  request_date?: string;
  start_time?: string;
  end_time?: string;
  offer_price?: number;
  notes?: string;
  status?: 'active' | 'accepted' | 'completed' | 'cancelled';
  accepted_by?: string;
}

// GET /buyer-requests - Get all active buyer requests
export const getBuyerRequests = async (filters?: {
  status?: 'active' | 'accepted' | 'completed' | 'cancelled';
  request_type?: 'dining' | 'grubhub';
  buyer_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<BuyerRequest[]> => {
  let query = supabase
    .from('buyer_requests')
    .select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.request_type) {
    query = query.eq('request_type', filters.request_type);
  }
  if (filters?.buyer_id) {
    query = query.eq('buyer_id', filters.buyer_id);
  }
  if (filters?.date_from) {
    query = query.gte('request_date', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('request_date', filters.date_to);
  }
  
  query = query.order('request_date', { ascending: true })
    .order('start_time', { ascending: true });
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// GET /buyer-requests/:id - Get buyer request by ID
export const getBuyerRequestById = async (id: string): Promise<BuyerRequest | null> => {
  const { data, error } = await supabase
    .from('buyer_requests')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// POST /buyer-requests - Create new buyer request
export const createBuyerRequest = async (requestData: CreateBuyerRequestData): Promise<BuyerRequest> => {
  const { data, error } = await supabase
    .from('buyer_requests')
    .insert(requestData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /buyer-requests/:id - Update buyer request
export const updateBuyerRequest = async (
  id: string, 
  updates: UpdateBuyerRequestData
): Promise<BuyerRequest> => {
  const { data, error } = await supabase
    .from('buyer_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /buyer-requests/:id/accept - Accept a buyer request (seller accepts)
export const acceptBuyerRequest = async (id: string, sellerId: string): Promise<BuyerRequest> => {
  const { data, error } = await supabase
    .from('buyer_requests')
    .update({ 
      status: 'accepted',
      accepted_by: sellerId 
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// DELETE /buyer-requests/:id - Delete buyer request
export const deleteBuyerRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('buyer_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

