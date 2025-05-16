import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import Stripe from "stripe";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { db } from "./db";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { createDownloadableZip, generateZipFile } from "./create-download-zip";

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}

// Initialize Stripe with our secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for creating a payment intent for course purchase
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { courseId, amount, planType } = req.body;
      
      if (!stripeClient) {
        return res.status(500).json({ 
          error: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." 
        });
      }
      
      if (!courseId || !amount || !planType) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Create payment intent with Stripe
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          courseId,
          planType,
        },
        // Additional payment method options can be added here
      });
      
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      return res.status(500).json({ 
        error: "Failed to create payment intent",
        details: error.message
      });
    }
  });
  
  // API route for creating a subscription
  app.post("/api/create-subscription", async (req: Request, res: Response) => {
    try {
      const { courseId, planType, paymentMethodId, customerId } = req.body;
      
      if (!stripeClient) {
        return res.status(500).json({ 
          error: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." 
        });
      }
      
      if (!courseId || !planType || !paymentMethodId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      let customer;
      
      // If we have an existing customer ID, use it. Otherwise create a new one.
      if (customerId) {
        customer = await stripeClient.customers.retrieve(customerId);
      } else {
        // In a real app, we would get user data from authenticated session
        customer = await stripeClient.customers.create({
          email: req.body.email || "customer@example.com",
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          }
        });
      }
      
      // Create the subscription
      // Note: In a real app, you would have pre-configured price IDs in Stripe
      const priceMappings: Record<string, string> = {
        monthly: "price_monthly_123", // These would be actual Stripe price IDs
        yearly: "price_yearly_456"
      };
      
      if (!priceMappings[planType]) {
        return res.status(400).json({ error: "Invalid plan type" });
      }
      
      const subscription = await stripeClient.subscriptions.create({
        customer: typeof customer === 'string' ? customer : customer.id,
        items: [
          {
            price: priceMappings[planType],
          },
        ],
        metadata: {
          courseId
        },
        expand: ['latest_invoice.payment_intent'],
      });
      
      // Get the invoice data
      const invoice = subscription.latest_invoice as any;
      
      return res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: invoice.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      return res.status(500).json({ 
        error: "Failed to create subscription",
        details: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
