import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRestaurantSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Restaurant } from "@shared/schema";
import { z } from "zod";

const restaurantFormSchema = insertRestaurantSchema.extend({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

interface RestaurantFormProps {
  initialData?: Restaurant;
}

export default function RestaurantForm({ initialData }: RestaurantFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      address: "",
      hours: "Mon-Sun: 11:00-22:00",
      imageUrl: "https://images.unsplash.com/photo-1494331789569-f98601f1934f",
      latitude: 28.4957, // Default to Gurugram
      longitude: 77.0909,
      sustainabilityInfo: "",
      menu: "",
      type: "Restaurant",
      maxPartySize: 8,
      timeSlotInterval: 30
    },
  });

  const onSubmit = async (values: RestaurantFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await apiRequest("PATCH", `/api/restaurants/${initialData.id}`, values);
        toast({
          description: "Restaurant updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/restaurants", values);
        toast({
          description: "Restaurant created successfully",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save restaurant. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Restaurant" : "Add New Restaurant"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              {...form.register("name")}
              placeholder="Restaurant name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...form.register("description")}
              placeholder="Restaurant description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              {...form.register("address")}
              placeholder="Full address in Gurugram"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                step="any"
                {...form.register("latitude", { valueAsNumber: true })}
              />
              {form.formState.errors.latitude && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.latitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                step="any"
                {...form.register("longitude", { valueAsNumber: true })}
              />
              {form.formState.errors.longitude && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hours</label>
            <Input
              {...form.register("hours")}
              placeholder="Operating hours (e.g., Mon-Sun: 11:00-22:00)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              {...form.register("imageUrl")}
              placeholder="URL for restaurant image"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sustainability Info</label>
            <Textarea
              {...form.register("sustainabilityInfo")}
              placeholder="Sustainability practices and initiatives"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Menu</label>
            <Textarea
              {...form.register("menu")}
              placeholder="Featured menu items"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              {...form.register("type")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Food Cart">Food Cart</option>
              <option value="Cafe">Cafe</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Party Size</label>
              <Input
                type="number"
                {...form.register("maxPartySize", { valueAsNumber: true })}
                min={1}
                max={20}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Slot Interval (minutes)</label>
              <Input
                type="number"
                {...form.register("timeSlotInterval", { valueAsNumber: true })}
                min={15}
                max={60}
                step={15}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (initialData ? "Update" : "Create")}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setLocation("/admin/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}