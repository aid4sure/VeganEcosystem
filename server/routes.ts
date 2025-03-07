import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRestaurantSchema, insertReviewSchema, insertReservationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all restaurants
  app.get("/api/restaurants", async (_req, res) => {
    const restaurants = await storage.getRestaurants();
    res.json(restaurants);
  });

  // Get single restaurant
  app.get("/api/restaurants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await storage.getRestaurant(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  });

  // Search restaurants
  app.get("/api/restaurants/search/:query", async (req, res) => {
    const query = req.params.query;
    const results = await storage.searchRestaurants(query);
    res.json(results);
  });

  // Create restaurant
  app.post("/api/restaurants", async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const restaurant = await storage.createRestaurant(restaurantData);
      res.status(201).json(restaurant);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid restaurant data", errors: error.errors });
      }
      throw error;
    }
  });

  // Get reviews for a restaurant
  app.get("/api/restaurants/:id/reviews", async (req, res) => {
    const restaurantId = parseInt(req.params.id);
    if (isNaN(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const reviews = await storage.getReviews(restaurantId);
    res.json(reviews);
  });

  // Create review
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      throw error;
    }
  });

  // Create reservation
  app.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      }
      throw error;
    }
  });

  // Get reservations for a restaurant on a specific date
  app.get("/api/restaurants/:id/reservations/:date", async (req, res) => {
    const restaurantId = parseInt(req.params.id);
    const date = new Date(req.params.date);

    if (isNaN(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const reservations = await storage.getReservations(restaurantId, date);
    res.json(reservations);
  });

  // Cancel reservation
  app.post("/api/reservations/:id/cancel", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }

    try {
      const reservation = await storage.cancelReservation(id);
      res.json(reservation);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  });

  // Create gift card
  app.post("/api/gift-cards", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.number().min(10).max(1000)
      });

      const { amount } = schema.parse(req.body);
      const giftCard = await storage.createGiftCard(amount);
      res.status(201).json(giftCard);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid amount", errors: error.errors });
      }
      throw error;
    }
  });

  // Get gift card
  app.get("/api/gift-cards/:code", async (req, res) => {
    const code = req.params.code;
    const giftCard = await storage.getGiftCard(code);

    if (!giftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }

    res.json(giftCard);
  });

  // Use gift card
  app.post("/api/gift-cards/:code/redeem", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.number().min(0)
      });

      const { amount } = schema.parse(req.body);
      const code = req.params.code;

      const giftCard = await storage.useGiftCard(code, amount);
      res.json(giftCard);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}