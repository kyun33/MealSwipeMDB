import { supabase } from '../supabase';

export interface GrubhubOffer {
  id: string;
  seller_id: string;
  restaurant: 'browns' | 'ladle' | 'monsoon';
  pickup_location: string;
  offer_date: string;
  max_amount: number;
  price: number;
  notes?: string;
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateGrubhubOfferData {
  seller_id: string;
  restaurant: 'browns' | 'ladle' | 'monsoon';
  pickup_location: string;
  offer_date: string;
  max_amount: number;
  price: number;
  notes?: string;
}

export interface UpdateGrubhubOfferData {
  restaurant?: 'browns' | 'ladle' | 'monsoon';
  pickup_location?: string;
  offer_date?: string;
  max_amount?: number;
  price?: number;
  notes?: string;
  status?: 'active' | 'sold' | 'cancelled';
}

// GET /grubhub-offers - Get all active grubhub offers
export const getGrubhubOffers = async (filters?: {
  status?: 'active' | 'sold' | 'cancelled';
  restaurant?: string;
  seller_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<GrubhubOffer[]> => {
  let query = supabase
    .from('grubhub_offers')
    .select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.restaurant) {
    query = query.eq('restaurant', filters.restaurant);
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
  
  query = query.order('offer_date', { ascending: true });
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// GET /grubhub-offers/:id - Get grubhub offer by ID
export const getGrubhubOfferById = async (id: string): Promise<GrubhubOffer | null> => {
  const { data, error } = await supabase
    .from('grubhub_offers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// POST /grubhub-offers - Create new grubhub offer
export const createGrubhubOffer = async (offerData: CreateGrubhubOfferData): Promise<GrubhubOffer> => {
  const { data, error } = await supabase
    .from('grubhub_offers')
    .insert(offerData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /grubhub-offers/:id - Update grubhub offer
export const updateGrubhubOffer = async (
  id: string, 
  updates: UpdateGrubhubOfferData
): Promise<GrubhubOffer> => {
  const { data, error } = await supabase
    .from('grubhub_offers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// DELETE /grubhub-offers/:id - Delete grubhub offer
export const deleteGrubhubOffer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('grubhub_offers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

