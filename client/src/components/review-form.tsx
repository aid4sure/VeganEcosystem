import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface ReviewFormProps {
  restaurantId: number;
}

export default function ReviewForm({ restaurantId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/reviews", {
        restaurantId,
        rating,
        comment
      });

      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/reviews`] });
      
      toast({
        description: "Review submitted successfully!",
      });

      setRating(0);
      setComment("");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />

      <Button 
        type="submit" 
        disabled={isSubmitting || rating === 0 || !comment.trim()}
      >
        Submit Review
      </Button>
    </form>
  );
}
