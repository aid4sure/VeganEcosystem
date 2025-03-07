import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantSearch from "@/components/restaurant-search";
import { Restaurant } from "@shared/schema";
import { Leaf } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: searchQuery 
      ? [`/api/restaurants/search/${searchQuery}`]
      : ["/api/restaurants"]
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Leaf className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Discover Vegan Restaurants</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the best vegan restaurants and food carts committed to sustainable practices
          and delicious plant-based cuisine.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <RestaurantSearch 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants?.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
