-- UC Berkeley Meal Swipe Marketplace - Supabase Schema
-- This schema supports dining hall offers, Grubhub offers, buyer requests, orders, messaging, and ratings

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user profile information and verification status
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  profile_image_url TEXT,
  id_verification_image_url TEXT,
  id_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DINING HALL OFFERS TABLE
-- Sellers offering dining hall meal swipes
-- =====================================================
CREATE TABLE dining_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dining_hall TEXT NOT NULL CHECK (dining_hall IN ('foothill', 'cafe3', 'clarkkerr', 'crossroads')),
  offer_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GRUBHUB OFFERS TABLE
-- Sellers offering Grubhub meal swipe orders
-- =====================================================
CREATE TABLE grubhub_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant TEXT NOT NULL CHECK (restaurant IN ('browns', 'ladle', 'monsoon')),
  pickup_location TEXT NOT NULL,
  offer_date DATE NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL CHECK (max_amount > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BUYER REQUESTS TABLE
-- Buyers posting what they need, sellers can browse and accept
-- =====================================================
CREATE TABLE buyer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('dining', 'grubhub')),
  dining_hall TEXT CHECK (dining_hall IN ('foothill', 'cafe3', 'clarkkerr', 'crossroads')),
  restaurant TEXT CHECK (restaurant IN ('browns', 'ladle', 'monsoon')),
  pickup_location TEXT,
  request_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  offer_price DECIMAL(10,2) NOT NULL CHECK (offer_price > 0),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'completed', 'cancelled')),
  accepted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_dining_fields CHECK (
    (request_type = 'dining' AND dining_hall IS NOT NULL AND end_time IS NOT NULL) OR
    (request_type = 'grubhub' AND restaurant IS NOT NULL AND pickup_location IS NOT NULL)
  )
);

-- =====================================================
-- ORDERS TABLE
-- Tracks all transactions (from offers or buyer requests)
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_type TEXT NOT NULL CHECK (order_type IN ('dining_offer', 'grubhub_offer', 'buyer_request')),
  dining_offer_id UUID REFERENCES dining_offers(id) ON DELETE SET NULL,
  grubhub_offer_id UUID REFERENCES grubhub_offers(id) ON DELETE SET NULL,
  buyer_request_id UUID REFERENCES buyer_requests(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('dining', 'grubhub')),
  dining_hall TEXT,
  restaurant TEXT,
  pickup_location TEXT,
  pickup_date DATE NOT NULL,
  pickup_time_start TIME NOT NULL,
  pickup_time_end TIME,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  buyer_rated BOOLEAN DEFAULT FALSE,
  seller_rated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_order_source CHECK (
    (order_type = 'dining_offer' AND dining_offer_id IS NOT NULL) OR
    (order_type = 'grubhub_offer' AND grubhub_offer_id IS NOT NULL) OR
    (order_type = 'buyer_request' AND buyer_request_id IS NOT NULL)
  )
);

-- =====================================================
-- MESSAGES TABLE
-- Chat messages between buyers and sellers
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RATINGS TABLE
-- User ratings and reviews after completed orders
-- =====================================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(order_id, rater_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_dining_offers_seller ON dining_offers(seller_id);
CREATE INDEX idx_dining_offers_status ON dining_offers(status);
CREATE INDEX idx_dining_offers_date ON dining_offers(offer_date);
CREATE INDEX idx_dining_offers_active ON dining_offers(status, offer_date) WHERE status = 'active';

CREATE INDEX idx_grubhub_offers_seller ON grubhub_offers(seller_id);
CREATE INDEX idx_grubhub_offers_status ON grubhub_offers(status);
CREATE INDEX idx_grubhub_offers_date ON grubhub_offers(offer_date);
CREATE INDEX idx_grubhub_offers_active ON grubhub_offers(status, offer_date) WHERE status = 'active';

CREATE INDEX idx_buyer_requests_buyer ON buyer_requests(buyer_id);
CREATE INDEX idx_buyer_requests_status ON buyer_requests(status);
CREATE INDEX idx_buyer_requests_date ON buyer_requests(request_date);
CREATE INDEX idx_buyer_requests_active ON buyer_requests(status, request_date) WHERE status = 'active';

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(pickup_date);

CREATE INDEX idx_messages_order ON messages(order_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

CREATE INDEX idx_ratings_order ON ratings(order_id);
CREATE INDEX idx_ratings_rated_user ON ratings(rated_user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dining_offers_updated_at BEFORE UPDATE ON dining_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grubhub_offers_updated_at BEFORE UPDATE ON grubhub_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_requests_updated_at BEFORE UPDATE ON buyer_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the rated user's profile
  UPDATE profiles
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM ratings
      WHERE rated_user_id = NEW.rated_user_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE rated_user_id = NEW.rated_user_id
    )
  WHERE id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings when a new rating is added
CREATE TRIGGER update_rating_on_insert AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to update total sales/purchases count
CREATE OR REPLACE FUNCTION update_transaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Update seller's total sales
    UPDATE profiles
    SET total_sales = total_sales + 1
    WHERE id = NEW.seller_id;
    
    -- Update buyer's total purchases
    UPDATE profiles
    SET total_purchases = total_purchases + 1
    WHERE id = NEW.buyer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update transaction counts
CREATE TRIGGER update_counts_on_order_complete AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_transaction_counts();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dining_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE grubhub_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view all profiles (for ratings, seller info)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- DINING OFFERS POLICIES
-- Anyone can view active offers
CREATE POLICY "Active dining offers viewable by everyone" ON dining_offers
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

-- Users can create their own offers
CREATE POLICY "Users can create own dining offers" ON dining_offers
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can update their own offers
CREATE POLICY "Users can update own dining offers" ON dining_offers
  FOR UPDATE USING (auth.uid() = seller_id);

-- Users can delete their own offers
CREATE POLICY "Users can delete own dining offers" ON dining_offers
  FOR DELETE USING (auth.uid() = seller_id);

-- GRUBHUB OFFERS POLICIES
-- Anyone can view active offers
CREATE POLICY "Active grubhub offers viewable by everyone" ON grubhub_offers
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

-- Users can create their own offers
CREATE POLICY "Users can create own grubhub offers" ON grubhub_offers
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can update their own offers
CREATE POLICY "Users can update own grubhub offers" ON grubhub_offers
  FOR UPDATE USING (auth.uid() = seller_id);

-- Users can delete their own offers
CREATE POLICY "Users can delete own grubhub offers" ON grubhub_offers
  FOR DELETE USING (auth.uid() = seller_id);

-- BUYER REQUESTS POLICIES
-- Anyone can view active requests
CREATE POLICY "Active buyer requests viewable by everyone" ON buyer_requests
  FOR SELECT USING (status = 'active' OR buyer_id = auth.uid());

-- Users can create their own requests
CREATE POLICY "Users can create own buyer requests" ON buyer_requests
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Users can update their own requests, or sellers can accept them
CREATE POLICY "Users can update own buyer requests" ON buyer_requests
  FOR UPDATE USING (auth.uid() = buyer_id OR (status = 'active' AND auth.uid() = accepted_by));

-- Users can delete their own requests
CREATE POLICY "Users can delete own buyer requests" ON buyer_requests
  FOR DELETE USING (auth.uid() = buyer_id);

-- ORDERS POLICIES
-- Users can view orders where they are buyer or seller
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can create orders where they are the buyer
CREATE POLICY "Users can create orders as buyer" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Buyers and sellers can update their orders
CREATE POLICY "Users can update their orders" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- MESSAGES POLICIES
-- Users can view messages where they are sender or receiver
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages where they are the sender
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (to mark as read)
CREATE POLICY "Users can update received messages" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RATINGS POLICIES
-- Anyone can view ratings
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

-- Users can create ratings where they are the rater and part of the order
CREATE POLICY "Users can create ratings for their orders" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
      AND orders.status = 'completed'
    )
  );

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment below to insert sample data for testing

/*
-- Sample profiles (you'll need to create auth users first)
INSERT INTO profiles (id, full_name, email, phone_number, id_verified, rating, total_ratings) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Chen', 'sarah@berkeley.edu', '510-555-0101', true, 4.8, 24),
  ('22222222-2222-2222-2222-222222222222', 'Michael Torres', 'michael@berkeley.edu', '510-555-0102', true, 4.9, 31),
  ('33333333-3333-3333-3333-333333333333', 'Emma Williams', 'emma@berkeley.edu', '510-555-0103', true, 4.7, 18);

-- Sample dining offers
INSERT INTO dining_offers (seller_id, dining_hall, offer_date, start_time, end_time, price, notes, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'foothill', CURRENT_DATE + INTERVAL '1 day', '17:00', '19:00', 7.00, 'Meet at main entrance', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'crossroads', CURRENT_DATE + INTERVAL '2 days', '18:30', '20:00', 6.50, NULL, 'active');

-- Sample grubhub offers
INSERT INTO grubhub_offers (seller_id, restaurant, pickup_location, offer_date, max_amount, price, notes, status) VALUES
  ('33333333-3333-3333-3333-333333333333', 'browns', 'Unit 2 Lobby', CURRENT_DATE + INTERVAL '1 day', 12.00, 8.00, 'Order by 5 PM', 'active');
*/
