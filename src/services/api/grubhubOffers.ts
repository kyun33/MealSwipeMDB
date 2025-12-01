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
  // If only updating status to 'sold', use the database function (bypasses RLS)
  if (Object.keys(updates).length === 1 && updates.status === 'sold') {
    try {
      const { error } = await supabase.rpc('mark_grubhub_offer_sold', {
        p_offer_id: id
      });
      
      if (error) {
        // If function doesn't exist, fall back to direct update
        if (error.code === '42883' || error.message?.includes('does not exist')) {
          console.log('RPC function not found, using direct update');
        } else {
          throw error;
        }
      } else {
        // Function succeeded, fetch the updated offer
        const { data, error: fetchError } = await supabase
          .from('grubhub_offers')
          .select('*')
          .eq('id', id)
          .limit(1);
        
        if (fetchError) throw fetchError;
        if (!data || data.length === 0) {
          throw new Error('Grubhub offer not found after update');
        }
        return data[0];
      }
    } catch (rpcError: any) {
      // Fall through to direct update if RPC fails
      if (rpcError.code !== '42883' && !rpcError.message?.includes('does not exist')) {
        console.warn('RPC function failed, trying direct update:', rpcError);
      }
    }
  }
  
  // Direct update (for other fields or if RPC function doesn't exist)
  const { data, error } = await supabase
    .from('grubhub_offers')
    .update(updates)
    .eq('id', id)
    .select()
    .limit(1);
  
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('Grubhub offer not found or could not be updated');
  }
  return data[0];
};

// DELETE /grubhub-offers/:id - Delete grubhub offer
export const deleteGrubhubOffer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('grubhub_offers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

