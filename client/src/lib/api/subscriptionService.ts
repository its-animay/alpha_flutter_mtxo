import apiRequest from './apiService';
import { API_ENDPOINTS } from './config';

// Types for Subscription API service
export interface PaymentMethod {
  type: 'credit_card' | 'paypal';
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  brand?: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: PaymentMethod;
  price: number;
  features: string[];
}

export interface PaymentHistory {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  description: string;
  status: 'successful' | 'failed' | 'pending' | 'refunded';
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface CreateSubscriptionRequest {
  planType: 'monthly' | 'yearly';
  paymentMethodId?: string;
}

export interface PaymentIntentRequest {
  courseId: string;
  planType: 'one-time' | 'monthly' | 'yearly';
}

/**
 * Subscription Service for subscription and payment operations
 */
const SubscriptionService = {
  /**
   * Get user's current subscription
   * @returns User subscription data
   */
  getUserSubscription: (): Promise<Subscription> => {
    return apiRequest(API_ENDPOINTS.SUBSCRIPTIONS.GET_USER_SUBSCRIPTION);
  },
  
  /**
   * Create new subscription
   * @param subscription Subscription details
   * @returns Created subscription
   */
  createSubscription: (subscription: CreateSubscriptionRequest): Promise<Subscription> => {
    return apiRequest(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, 'POST', subscription);
  },
  
  /**
   * Update subscription
   * @param id Subscription ID
   * @param subscription Updated subscription details
   * @returns Updated subscription
   */
  updateSubscription: (id: number, subscription: Partial<Subscription>): Promise<Subscription> => {
    return apiRequest(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE(id), 'PUT', subscription);
  },
  
  /**
   * Cancel subscription
   * @param id Subscription ID
   * @returns Cancellation result
   */
  cancelSubscription: (id: number): Promise<{success: boolean, message: string}> => {
    return apiRequest(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL(id), 'POST');
  },
  
  /**
   * Get payment history
   * @returns List of payment history items
   */
  getPaymentHistory: (): Promise<PaymentHistory[]> => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.GET_PAYMENT_HISTORY);
  },
  
  /**
   * Create payment intent for one-time purchase
   * @param paymentIntent Payment intent details
   * @returns Client secret for Stripe
   */
  createPaymentIntent: (paymentIntent: PaymentIntentRequest): Promise<{clientSecret: string}> => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.CREATE_PAYMENT_INTENT, 'POST', paymentIntent);
  },
  
  /**
   * Create subscription payment intent
   * @param paymentIntent Payment intent details
   * @returns Client secret for Stripe
   */
  createSubscriptionIntent: (paymentIntent: PaymentIntentRequest): Promise<{clientSecret: string, subscriptionId: string}> => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.CREATE_SUBSCRIPTION, 'POST', paymentIntent);
  }
};

export default SubscriptionService;