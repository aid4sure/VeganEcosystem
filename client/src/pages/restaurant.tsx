import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Restaurant, Review } from "@shared/schema";
import MapView from "@/components/map-view";
import ReviewForm from "@/components/review-form";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Leaf, MapPin, UtensilsCrossed } from "lucide-react";
import { format } from "date-fns";

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
        </div>

        <div className="space-y-6">
          <MapView restaurant={restaurant} />

          <div>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              <ReviewForm restaurantId={restaurant.id} />

              {isLoadingReviews ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews?.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <span className="text-sm text-gray-400">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
