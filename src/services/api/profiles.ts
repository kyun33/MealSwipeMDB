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
    .single();
  
  if (error) throw error;
  return data;
};

// POST /profiles - Create new profile
export const createProfile = async (profileData: CreateProfileData): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
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
  
  return getProfileById(user.id);
};

