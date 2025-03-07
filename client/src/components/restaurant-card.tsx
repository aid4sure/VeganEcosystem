import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Restaurant } from "@shared/schema";
import { Link } from "wouter";
import { Clock, MapPin } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <a className="block hover:no-underline">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div 
            className="h-48 bg-cover bg-center" 
            style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
          />
          <CardHeader className="pb-2">
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <span className="text-sm text-muted-foreground">{restaurant.type}</span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{restaurant.hours}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
