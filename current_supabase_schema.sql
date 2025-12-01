-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.buyer_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  buyer_id uuid NOT NULL,
  request_type text NOT NULL CHECK (request_type = ANY (ARRAY['dining'::text, 'grubhub'::text])),
  dining_hall text CHECK (dining_hall = ANY (ARRAY['foothill'::text, 'cafe3'::text, 'clarkkerr'::text, 'crossroads'::text])),
  restaurant text CHECK (restaurant = ANY (ARRAY['browns'::text, 'ladle'::text, 'monsoon'::text])),
  pickup_location text,
  request_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone,
  offer_price numeric NOT NULL CHECK (offer_price > 0::numeric),
  notes text,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'accepted'::text, 'completed'::text, 'cancelled'::text])),
  accepted_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT buyer_requests_pkey PRIMARY KEY (id),
  CONSTRAINT buyer_requests_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id),
  CONSTRAINT buyer_requests_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.dining_offers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  seller_id uuid NOT NULL,
  dining_hall text NOT NULL CHECK (dining_hall = ANY (ARRAY['foothill'::text, 'cafe3'::text, 'clarkkerr'::text, 'crossroads'::text])),
  offer_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  price numeric NOT NULL CHECK (price > 0::numeric),
  notes text,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'sold'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dining_offers_pkey PRIMARY KEY (id),
  CONSTRAINT dining_offers_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.grubhub_offers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  seller_id uuid NOT NULL,
  restaurant text NOT NULL CHECK (restaurant = ANY (ARRAY['browns'::text, 'ladle'::text, 'monsoon'::text])),
  pickup_location text NOT NULL,
  offer_date date NOT NULL,
  max_amount numeric NOT NULL CHECK (max_amount > 0::numeric),
  price numeric NOT NULL CHECK (price > 0::numeric),
  notes text,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'sold'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grubhub_offers_pkey PRIMARY KEY (id),
  CONSTRAINT grubhub_offers_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message_text text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
  CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_type text NOT NULL CHECK (order_type = ANY (ARRAY['dining_offer'::text, 'grubhub_offer'::text, 'buyer_request'::text])),
  dining_offer_id uuid,
  grubhub_offer_id uuid,
  buyer_request_id uuid,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type = ANY (ARRAY['dining'::text, 'grubhub'::text])),
  dining_hall text,
  restaurant text,
  pickup_location text,
  pickup_date date NOT NULL,
  pickup_time_start time without time zone NOT NULL,
  pickup_time_end time without time zone,
  price numeric NOT NULL CHECK (price > 0::numeric),
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])),
  buyer_rated boolean DEFAULT false,
  seller_rated boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_buyer_request_id_fkey FOREIGN KEY (buyer_request_id) REFERENCES public.buyer_requests(id),
  CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_dining_offer_id_fkey FOREIGN KEY (dining_offer_id) REFERENCES public.dining_offers(id),
  CONSTRAINT orders_grubhub_offer_id_fkey FOREIGN KEY (grubhub_offer_id) REFERENCES public.grubhub_offers(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number text,
  profile_image_url text,
  id_verification_image_url text,
  id_verified boolean DEFAULT false,
  rating numeric DEFAULT 0.00,
  total_ratings integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  total_purchases integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.ratings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  rater_id uuid NOT NULL,
  rated_user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ratings_pkey PRIMARY KEY (id),
  CONSTRAINT ratings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT ratings_rater_id_fkey FOREIGN KEY (rater_id) REFERENCES public.profiles(id),
  CONSTRAINT ratings_rated_user_id_fkey FOREIGN KEY (rated_user_id) REFERENCES public.profiles(id)
);