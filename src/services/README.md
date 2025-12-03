# API Services Documentation

This directory contains RESTful API service functions that connect the React Native frontend to the Supabase backend.

## Setup

1. Create a `.env` file in the root directory with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Install dependencies:
```bash
npm install
```

## API Structure

All API functions follow RESTful principles:

- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Remove resources

## Available Services

### Authentication (`supabase.ts`)
- `auth.signIn(email, password)` - Sign in user
- `auth.signUp(email, password, metadata?)` - Sign up new user
- `auth.signOut()` - Sign out current user
- `auth.getCurrentUser()` - Get current authenticated user
- `auth.getSession()` - Get current session

### Profiles (`api/profiles.ts`)
- `getProfiles()` - Get all profiles
- `getProfileById(id)` - Get profile by ID
- `getMyProfile()` - Get current user's profile
- `createProfile(data)` - Create new profile
- `updateProfile(id, updates)` - Update profile

### Dining Offers (`api/diningOffers.ts`)
- `getDiningOffers(filters?)` - Get dining offers with optional filters
- `getDiningOfferById(id)` - Get dining offer by ID
- `createDiningOffer(data)` - Create new dining offer
- `updateDiningOffer(id, updates)` - Update dining offer
- `deleteDiningOffer(id)` - Delete dining offer

### Grubhub Offers (`api/grubhubOffers.ts`)
- `getGrubhubOffers(filters?)` - Get grubhub offers with optional filters
- `getGrubhubOfferById(id)` - Get grubhub offer by ID
- `createGrubhubOffer(data)` - Create new grubhub offer
- `updateGrubhubOffer(id, updates)` - Update grubhub offer
- `deleteGrubhubOffer(id)` - Delete grubhub offer

### Buyer Requests (`api/buyerRequests.ts`)
- `getBuyerRequests(filters?)` - Get buyer requests with optional filters
- `getBuyerRequestById(id)` - Get buyer request by ID
- `createBuyerRequest(data)` - Create new buyer request
- `updateBuyerRequest(id, updates)` - Update buyer request
- `acceptBuyerRequest(id, sellerId)` - Accept a buyer request (seller action)
- `deleteBuyerRequest(id)` - Delete buyer request

### Orders (`api/orders.ts`)
- `getOrders(filters?)` - Get orders with optional filters
- `getOrderById(id)` - Get order by ID
- `createOrder(data)` - Create new order
- `updateOrder(id, updates)` - Update order
- `confirmOrder(id)` - Confirm an order
- `completeOrder(id)` - Complete an order
- `cancelOrder(id)` - Cancel an order

### Messages (`api/messages.ts`)
- `getMessages(orderId)` - Get all messages for an order
- `getUnreadMessages(userId)` - Get unread messages for a user
- `createMessage(data)` - Send a new message
- `markMessageAsRead(id)` - Mark a message as read
- `markAllMessagesAsRead(orderId, userId)` - Mark all messages in an order as read

**Real-time Messaging**: The messaging system uses Supabase Realtime (WebSockets) to provide instant message delivery. Messages are automatically synchronized across all connected clients in real-time. Requires enabling Realtime for the `messages` table (see setup instructions below).

### Ratings (`api/ratings.ts`)
- `getRatings(userId)` - Get all ratings for a user
- `getRatingsByOrder(orderId)` - Get ratings for an order
- `getRatingById(id)` - Get rating by ID
- `createRating(data)` - Create a new rating

## Usage Examples

### Example 1: Get Active Dining Offers
```typescript
import { getDiningOffers } from './services/api';

const offers = await getDiningOffers({ 
  status: 'active',
  dining_hall: 'crossroads'
});
```

### Example 2: Create a Buyer Request
```typescript
import { createBuyerRequest } from './services/api';

const request = await createBuyerRequest({
  buyer_id: userId,
  request_type: 'dining',
  dining_hall: 'foothill',
  request_date: '2024-11-20',
  start_time: '18:00',
  end_time: '19:30',
  offer_price: 7.00,
  notes: 'Need swipe for dinner'
});
```

### Example 3: Create an Order from an Offer
```typescript
import { createOrder, getDiningOfferById } from './services/api';

const offer = await getDiningOfferById(offerId);
const order = await createOrder({
  order_type: 'dining_offer',
  dining_offer_id: offerId,
  buyer_id: currentUserId,
  seller_id: offer.seller_id,
  item_type: 'dining',
  dining_hall: offer.dining_hall,
  pickup_date: offer.offer_date,
  pickup_time_start: offer.start_time,
  pickup_time_end: offer.end_time,
  price: offer.price
});
```

### Example 4: Send a Message
```typescript
import { createMessage } from './services/api';

const message = await createMessage({
  order_id: orderId,
  sender_id: currentUserId,
  receiver_id: otherUserId,
  message_text: 'Hi! I just bought your meal swipe.'
});
```

## Error Handling

All API functions throw errors that should be caught and handled:

```typescript
try {
  const offers = await getDiningOffers();
} catch (error) {
  console.error('Error fetching offers:', error);
  // Handle error (show toast, retry, etc.)
}
```

## Real-time Messaging Setup

The messaging system uses **Supabase Realtime** to provide instant message delivery via WebSockets. Messages are automatically synchronized across all connected clients in real-time.

### Setup Required

**Enable Realtime for the messages table** by running this SQL in your Supabase SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```
(See `enable_realtime_messages.sql` in the root directory)

### How It Works

- The `ChatScreen` component automatically subscribes to Realtime changes when opened
- When a message is created, updated, or deleted in the `messages` table, all connected clients subscribed to that order's messages receive the update instantly
- Messages are filtered by `order_id` to only receive relevant messages
- Image URLs are automatically processed and signed when received via Realtime
- Subscriptions are automatically cleaned up when the chat screen is closed or the component unmounts

### Realtime Events Handled

- **INSERT**: New messages appear instantly for all participants
- **UPDATE**: Message updates (e.g., read status) are synchronized in real-time
- **DELETE**: Message deletions are reflected immediately

### Benefits

- ✅ **Instant delivery**: Messages appear in < 100ms
- ✅ **Efficient**: No polling overhead, only receives actual changes
- ✅ **Scalable**: WebSocket connections are more efficient than polling
- ✅ **Integrated**: Works seamlessly with your existing Supabase setup and RLS policies

### Note

According to the [Supabase Realtime GitHub repo](https://github.com/supabase/realtime), Postgres Changes is GA (Generally Available) and works on the free tier. The feature is production-ready and doesn't require any paid plans.

## Row Level Security (RLS)

The Supabase backend has Row Level Security enabled. Users can only:
- View their own data and public data (active offers, active requests)
- Create/update/delete their own resources
- Access orders where they are the buyer or seller
- View messages where they are the sender or receiver

