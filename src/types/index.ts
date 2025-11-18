// This file exports TypeScript types and interfaces used in the application.

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    price: number;
    sellerId: string;
    createdAt: string;
}

export interface BuyerRequest {
    id: string;
    title: string;
    description: string;
    buyerId: string;
    createdAt: string;
}

export interface Order {
    id: string;
    offerId: string;
    buyerId: string;
    sellerId: string;
    status: 'pending' | 'completed' | 'canceled';
    createdAt: string;
}

export interface Rating {
    id: string;
    userId: string;
    orderId: string;
    score: number;
    comment?: string;
    createdAt: string;
}