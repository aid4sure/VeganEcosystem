import { Restaurant, InsertRestaurant, Review, InsertReview, GiftCard, InsertGiftCard } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Restaurant operations
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  searchRestaurants(query: string): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;

  // Review operations
  getReviews(restaurantId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Gift card operations
  createGiftCard(amount: number): Promise<GiftCard>;
  getGiftCard(code: string): Promise<GiftCard | undefined>;
  useGiftCard(code: string, amount: number): Promise<GiftCard>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private reviews: Map<number, Review>;
  private giftCards: Map<string, GiftCard>;
  private currentRestaurantId: number;
  private currentReviewId: number;
  private currentGiftCardId: number;

  constructor() {
    this.restaurants = new Map();
    this.reviews = new Map();
    this.giftCards = new Map();
    this.currentRestaurantId = 1;
    this.currentReviewId = 1;
    this.currentGiftCardId = 1;

    // Add initial sample data
    this.initializeSampleData();
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.restaurants.values()).filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(lowercaseQuery) ||
        restaurant.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant: Restaurant = { ...insertRestaurant, id };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async getReviews(restaurantId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.restaurantId === restaurantId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async createGiftCard(amount: number): Promise<GiftCard> {
    const id = this.currentGiftCardId++;
    const code = nanoid(10).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Valid for 1 year

    const giftCard: GiftCard = {
      id,
      code,
      amount,
      balance: amount,
      createdAt: new Date(),
      expiresAt,
      isActive: 1
    };

    this.giftCards.set(code, giftCard);
    return giftCard;
  }

  async getGiftCard(code: string): Promise<GiftCard | undefined> {
    return this.giftCards.get(code);
  }

  async useGiftCard(code: string, amount: number): Promise<GiftCard> {
    const giftCard = this.giftCards.get(code);
    if (!giftCard) {
      throw new Error("Gift card not found");
    }
    if (!giftCard.isActive) {
      throw new Error("Gift card is inactive");
    }
    if (giftCard.expiresAt < new Date()) {
      throw new Error("Gift card has expired");
    }
    if (giftCard.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const updatedGiftCard: GiftCard = {
      ...giftCard,
      balance: giftCard.balance - amount,
      isActive: giftCard.balance - amount === 0 ? 0 : 1
    };

    this.giftCards.set(code, updatedGiftCard);
    return updatedGiftCard;
  }

  private initializeSampleData() {
    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "Green Earth Kitchen",
        description: "Farm-to-table vegan cuisine with sustainable practices",
        address: "123 Eco Street, Green City",
        hours: "Mon-Sun: 11:00-22:00",
        imageUrl: "https://images.unsplash.com/photo-1494331789569-f98601f1934f",
        latitude: 40.7128,
        longitude: -74.006,
        sustainabilityInfo: "Solar powered, zero-waste policy, composting program",
        menu: "Quinoa Buddha Bowl, Beyond Burger, Garden Fresh Salad",
        type: "Restaurant"
      },
      {
        name: "Plant Power Cart",
        description: "Mobile vegan street food with global flavors",
        address: "456 Food Cart Way, Green City",
        hours: "Mon-Sat: 12:00-20:00",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        latitude: 40.7129,
        longitude: -74.007,
        sustainabilityInfo: "100% compostable packaging, local ingredients",
        menu: "Jackfruit Tacos, Tempeh Bowl, Sweet Potato Fries",
        type: "Food Cart"
      }
    ];

    sampleRestaurants.forEach((restaurant) => {
      this.createRestaurant(restaurant);
    });
  }
}

export const storage = new MemStorage();