import { supabase } from '../supabase';

export interface DiningOffer {
  id: string;
  seller_id: string;
  dining_hall: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  offer_date: string;
  start_time: string;
  end_time: string;
  price: number;
  notes?: string;
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateDiningOfferData {
  seller_id: string;
  dining_hall: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  offer_date: string;
  start_time: string;
  end_time: string;
  price: number;
  notes?: string;
}

export interface UpdateDiningOfferData {
  dining_hall?: 'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads';
  offer_date?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  notes?: string;
  status?: 'active' | 'sold' | 'cancelled';
}

// GET /dining-offers - Get all active dining offers
export const getDiningOffers = async (filters?: {
  status?: 'active' | 'sold' | 'cancelled';
  dining_hall?: string;
  seller_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<DiningOffer[]> => {
  let query = supabase
    .from('dining_offers')
    .select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.dining_hall) {
    query = query.eq('dining_hall', filters.dining_hall);
  }
  if (filters?.seller_id) {
    query = query.eq('seller_id', filters.seller_id);
  }
  if (filters?.date_from) {
    query = query.gte('offer_date', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('offer_date', filters.date_to);
  }
  
  query = query.order('offer_date', { ascending: true })
    .order('start_time', { ascending: true });
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// GET /dining-offers/:id - Get dining offer by ID
export const getDiningOfferById = async (id: string): Promise<DiningOffer | null> => {
  const { data, error } = await supabase
    .from('dining_offers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// POST /dining-offers - Create new dining offer
export const createDiningOffer = async (offerData: CreateDiningOfferData): Promise<DiningOffer> => {
  const { data, error } = await supabase
    .from('dining_offers')
    .insert(offerData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /dining-offers/:id - Update dining offer
export const updateDiningOffer = async (
  id: string, 
  updates: UpdateDiningOfferData
): Promise<DiningOffer> => {
  const { data, error } = await supabase
    .from('dining_offers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// DELETE /dining-offers/:id - Delete dining offer
export const deleteDiningOffer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('dining_offers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

