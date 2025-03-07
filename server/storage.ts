import { Restaurant, InsertRestaurant, Review, InsertReview, GiftCard, InsertGiftCard, Reservation, InsertReservation } from "@shared/schema";
import { nanoid } from "nanoid";

interface Admin {
    id: number;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export interface IStorage {
  // Restaurant operations
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  searchRestaurants(query: string): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;

  // Review operations
  getReviews(restaurantId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Reservation operations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservations(restaurantId: number, date: Date): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  cancelReservation(id: number): Promise<Reservation>;

  // Gift card operations
  createGiftCard(amount: number): Promise<GiftCard>;
  getGiftCard(code: string): Promise<GiftCard | undefined>;
  useGiftCard(code: string, amount: number): Promise<GiftCard>;

  // Admin operations
  loginAdmin(username: string, password: string): Promise<string | null>;
  verifyAdminSession(token: string | undefined): Promise<boolean>;
  deleteRestaurant(id: number): Promise<void>;
  updateRestaurant(id: number, restaurant: InsertRestaurant): Promise<Restaurant>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private reviews: Map<number, Review>;
  private giftCards: Map<string, GiftCard>;
  private reservations: Map<number, Reservation>;
  private currentRestaurantId: number;
  private currentReviewId: number;
  private currentGiftCardId: number;
  private currentReservationId: number;
  private admins: Map<string, Admin>;
  private adminSessions: Map<string, string>;

  constructor() {
    this.restaurants = new Map();
    this.reviews = new Map();
    this.giftCards = new Map();
    this.reservations = new Map();
    this.currentRestaurantId = 1;
    this.currentReviewId = 1;
    this.currentGiftCardId = 1;
    this.currentReservationId = 1;
    this.admins = new Map();
    this.adminSessions = new Map();

    // Add a default admin for testing
    this.admins.set("admin", {
      id: 1,
      username: "admin",
      passwordHash: "admin123", // In production, use proper password hashing
      createdAt: new Date(),
    });

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

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const reservation: Reservation = {
      ...insertReservation,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async getReservations(restaurantId: number, date: Date): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      (reservation) =>
        reservation.restaurantId === restaurantId &&
        reservation.date.toDateString() === date.toDateString()
    );
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async cancelReservation(id: number): Promise<Reservation> {
    const reservation = this.reservations.get(id);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const updatedReservation: Reservation = {
      ...reservation,
      status: "cancelled"
    };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
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

  async loginAdmin(username: string, password: string): Promise<string | null> {
    const admin = this.admins.get(username);
    if (!admin || admin.passwordHash !== password) {
      return null;
    }

    const token = nanoid();
    this.adminSessions.set(token, username);
    return token;
  }

  async verifyAdminSession(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    return this.adminSessions.has(token);
  }

  async deleteRestaurant(id: number): Promise<void> {
    if (!this.restaurants.has(id)) {
      throw new Error("Restaurant not found");
    }
    this.restaurants.delete(id);
  }

  async updateRestaurant(id: number, restaurant: InsertRestaurant): Promise<Restaurant> {
    if (!this.restaurants.has(id)) {
      throw new Error("Restaurant not found");
    }
    const updatedRestaurant = { ...restaurant, id };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  private initializeSampleData() {
    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "Green Earth Kitchen",
        description: "Farm-to-table vegan cuisine with sustainable practices",
        address: "DLF Cyber City, Sector 24, Gurugram, Haryana 122002",
        hours: "Mon-Sun: 11:00-22:00",
        imageUrl: "https://images.unsplash.com/photo-1494331789569-f98601f1934f",
        latitude: 28.4957,
        longitude: 77.0909,
        sustainabilityInfo: "Solar powered, zero-waste policy, composting program",
        menu: "Quinoa Buddha Bowl, Beyond Burger, Garden Fresh Salad",
        type: "Restaurant",
        maxPartySize: 8,
        timeSlotInterval: 30
      },
      {
        name: "Plant Power Cart",
        description: "Mobile vegan street food with global flavors",
        address: "Galleria Market, DLF Phase 4, Gurugram, Haryana 122009",
        hours: "Mon-Sat: 12:00-20:00",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        latitude: 28.4689,
        longitude: 77.0583,
        sustainabilityInfo: "100% compostable packaging, local ingredients",
        menu: "Jackfruit Tacos, Tempeh Bowl, Sweet Potato Fries",
        type: "Food Cart",
        maxPartySize: 4,
        timeSlotInterval: 15
      },
      {
        name: "Mindful Bites",
        description: "Contemporary vegan cafe with a focus on healthy eating",
        address: "Golf Course Road, Sector 53, Gurugram, Haryana 122003",
        hours: "Mon-Sun: 09:00-21:00",
        imageUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
        latitude: 28.4372,
        longitude: 77.1042,
        sustainabilityInfo: "Organic produce, plastic-free packaging, rainwater harvesting",
        menu: "Smoothie Bowls, Avocado Toast, Mushroom Risotto",
        type: "Cafe",
        maxPartySize: 6,
        timeSlotInterval: 30
      }
    ];

    sampleRestaurants.forEach((restaurant) => {
      this.createRestaurant(restaurant);
    });
  }
}

export const storage = new MemStorage();