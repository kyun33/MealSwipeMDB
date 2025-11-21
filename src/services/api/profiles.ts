import { supabase } from '../supabase';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  profile_image_url?: string;
  id_verification_image_url?: string;
  id_verified: boolean;
  rating: number;
  total_ratings: number;
  total_sales: number;
  total_purchases: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  profile_image_url?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone_number?: string;
  profile_image_url?: string;
  id_verification_image_url?: string;
  id_verified?: boolean;
}

// GET /profiles - Get all profiles (public)
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// GET /profiles/:id - Get profile by ID
export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// POST /profiles - Create new profile
export const createProfile = async (profileData: CreateProfileData): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      ...profileData,
      rating: 5.00, // Default rating for new sellers
      total_ratings: 0,
      total_sales: 0,
      total_purchases: 0,
      id_verified: false
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// PUT /profiles/:id - Update profile
export const updateProfile = async (id: string, updates: UpdateProfileData): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// GET /profiles/me - Get current user's profile
export const getMyProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  let profile = await getProfileById(user.id);
  
  // If profile doesn't exist, try to create one from user metadata
  if (!profile && user.email) {
    try {
      const fullName = user.user_metadata?.full_name || user.email.split('@')[0] || 'User';
      profile = await createProfile({
        id: user.id,
        email: user.email,
        full_name: fullName,
      });
      // Rating is set to 5.00 by default in createProfile
    } catch (error) {
      // If profile creation fails (e.g., duplicate or RLS issue), just return null
      console.error('Error auto-creating profile:', error);
      return null;
    }
  }
  
  return profile;
};

