import Map, { Marker } from "react-map-gl";
import { Restaurant } from "@shared/schema";
import { MapPin } from "lucide-react";

interface MapViewProps {
  restaurant: Restaurant;
}

export default function MapView({ restaurant }: MapViewProps) {
  return (
    <div className="h-[300px] rounded-lg overflow-hidden">
      <Map
        initialViewState={{
          longitude: restaurant.longitude,
          latitude: restaurant.latitude,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        <Marker
          longitude={restaurant.longitude}
          latitude={restaurant.latitude}
        >
          <MapPin className="h-6 w-6 text-primary" />
        </Marker>
      </Map>
    </div>
  );
}
