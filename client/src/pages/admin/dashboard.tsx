import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Restaurant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await apiRequest("DELETE", `/api/restaurants/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      toast({
        description: "Restaurant deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete restaurant",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <Button onClick={() => setLocation("/admin/restaurants/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      <div className="grid gap-4">
        {restaurants?.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/admin/restaurants/${restaurant.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting === restaurant.id}
                  onClick={() => handleDelete(restaurant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
