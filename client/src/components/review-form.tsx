import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { insertReviewSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const reviewFormSchema = insertReviewSchema.extend({
  comment: z.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters"),
  rating: z.number()
    .min(1, "Please select a rating")
    .max(5, "Maximum rating is 5 stars")
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  restaurantId: number;
}

export default function ReviewForm({ restaurantId }: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      restaurantId,
      rating: 0,
      comment: ""
    }
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/reviews", values);
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/reviews`] });

      toast({
        description: "Review submitted successfully!",
      });

      form.reset();
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => form.setValue("rating", value)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= form.watch("rating")
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              {...form.register("comment")}
              placeholder="Share your dining experience... (min 10 characters)"
              className="min-h-[100px] resize-none"
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-destructive">
                {form.formState.errors.comment.message}
              </p>
            )}
            <div className="text-xs text-muted-foreground text-right">
              {form.watch("comment")?.length ?? 0}/500
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}