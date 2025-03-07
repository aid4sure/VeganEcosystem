import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Restaurant, Review } from "@shared/schema";
import MapView from "@/components/map-view";
import ReviewForm from "@/components/review-form";
import ReservationForm from "@/components/reservation-form";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Leaf, MapPin, UtensilsCrossed } from "lucide-react";
import { format } from "date-fns";
import ReviewList from "@/components/review-list";

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = parseInt(id);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${restaurantId}`]
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/restaurants/${restaurantId}/reviews`]
  });

  if (isLoadingRestaurant) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="space-y-8">
      <div 
        className="h-64 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{restaurant.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <UtensilsCrossed className="h-5 w-5" />
              <span>{restaurant.type}</span>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Sustainability Practices</h2>
              </div>
              <p className="text-gray-600">{restaurant.sustainabilityInfo}</p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Menu Highlights</h2>
            <p className="text-gray-600">{restaurant.menu}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
            <ReservationForm 
              restaurantId={restaurant.id}
              maxPartySize={restaurant.maxPartySize}
              timeSlotInterval={restaurant.timeSlotInterval}
            />
          </div>
        </div>

        <div className="space-y-6">
          <MapView restaurant={restaurant} />

          <div>
            <h2 className="text-xl font-semibold mb-6">Write a Review</h2>
            <ReviewForm restaurantId={restaurant.id} />

            <div className="mt-8">
              {isLoadingReviews ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <ReviewList reviews={reviews || []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}