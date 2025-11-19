import { supabase } from '../supabase';

export interface Rating {
  id: string;
  order_id: string;
  rater_id: string;
  rated_user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface CreateRatingData {
  order_id: string;
  rater_id: string;
  rated_user_id: string;
  rating: number;
  review_text?: string;
}

// GET /ratings - Get ratings for a user
export const getRatings = async (userId: string): Promise<Rating[]> => {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('rated_user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// GET /ratings/order/:orderId - Get ratings for an order
export const getRatingsByOrder = async (orderId: string): Promise<Rating[]> => {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// GET /ratings/:id - Get rating by ID
export const getRatingById = async (id: string): Promise<Rating | null> => {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// POST /ratings - Create new rating
export const createRating = async (ratingData: CreateRatingData): Promise<Rating> => {
  const { data, error } = await supabase
    .from('ratings')
    .insert(ratingData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

