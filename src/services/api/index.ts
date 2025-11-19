// Centralized API exports following RESTful principles
export * from './profiles';
export * from './diningOffers';
export * from './grubhubOffers';
export * from './buyerRequests';
export * from './orders';
export * from './messages';
export * from './ratings';

// Re-export supabase client and auth
export { supabase, auth } from '../supabase';

