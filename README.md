# MealSwipe Expo App

MealSwipe is an Expo application that allows users to manage their dining offers and requests seamlessly. This app provides a platform for buyers and sellers to interact, create offers, and manage orders.

## Project Structure

The project is organized as follows:

```
MealSwipe-Expo
├── src
│   ├── App.tsx                     # Main entry point of the application
│   ├── index.ts                    # Registers the main application component
│   ├── navigation
│   │   └── RootNavigator.tsx       # Defines the root navigation structure
│   ├── screens
│   │   ├── HomeScreen.tsx          # Main interface for users
│   │   ├── SellHubScreen.tsx       # Manage selling offers
│   │   ├── BuyerRequestsScreen.tsx  # Displays buyer requests
│   │   ├── OrdersBuyer.tsx         # Shows orders made by buyers
│   │   ├── OrdersSeller.tsx        # Shows orders made by sellers
│   │   ├── ChatScreen.tsx          # Facilitates communication between users
│   │   ├── CreateBuyerRequest.tsx   # Create new buyer requests
│   │   ├── CreateOfferDining.tsx   # Create dining offers
│   │   ├── CreateOfferGrubhub.tsx  # Create Grubhub offers
│   │   ├── OrderDetailsDining.tsx  # Displays details of dining orders
│   │   ├── OrderDetailsGrubhub.tsx # Displays details of Grubhub orders
│   │   ├── ProfileScreen.tsx       # Displays user profile information
│   │   ├── RatingScreen.tsx        # Allows users to rate their experiences
│   │   ├── IDVerificationScreen.tsx # Handles user ID verification
│   │   └── OnboardingScreen.tsx     # Guides new users through setup
│   ├── components
│   │   ├── BottomNav.tsx           # Navigation options at the bottom
│   │   ├── common
│   │   │   ├── Button.tsx          # Reusable Button component
│   │   │   ├── Avatar.tsx          # Displays user images
│   │   │   └── ImageWithFallback.tsx # Image with fallback option
│   │   └── ui                       # Shared UI primitives
│   ├── hooks
│   │   └── useAuth.ts              # Custom hook for user authentication
│   ├── services
│   │   └── supabase.ts             # Interacts with Supabase backend
│   ├── utils
│   │   └── index.ts                # Utility functions
│   └── types
│       └── index.ts                # TypeScript types and interfaces
├── assets
│   ├── fonts                       # Custom font files
│   └── icons                       # Icon files
├── app.json                        # Configuration settings for the Expo app
├── babel.config.js                 # Babel configuration settings
├── package.json                    # npm configuration file
├── tsconfig.json                   # TypeScript configuration file
└── README.md                       # Documentation for the project
```

## Getting Started

To get started with the MealSwipe Expo app, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd MealSwipe-Expo
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the app:**
   ```
   npm start
   ```

## Features

- User authentication and ID verification
- Create and manage dining offers
- View and respond to buyer requests
- Chat functionality between users
- Order management for buyers and sellers
- User profile management and ratings

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.