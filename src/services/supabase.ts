import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase variables not set. Check your .env file and restart the server with 'expo start -c'."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data;
};

export const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const fetchData = async (table) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
};