import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { insertReservationSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, addMinutes, parse, isAfter, startOfToday } from "date-fns";
import { z } from "zod";

const reservationFormSchema = insertReservationSchema.extend({
  date: z.string().refine((val) => {
    const date = new Date(val);
    return isAfter(date, startOfToday());
  }, "Please select a future date and time"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ReservationFormProps {
  restaurantId: number;
  maxPartySize: number;
  timeSlotInterval: number;
}

export default function ReservationForm({ 
  restaurantId, 
  maxPartySize,
  timeSlotInterval 
}: ReservationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      restaurantId,
      partySize: 2,
      date: format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
      name: "",
      email: "",
      phone: "",
    }
  });

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const start = parse("11:00", "HH:mm", now);
    const end = parse("22:00", "HH:mm", now);
    
    let current = start;
    while (current <= end) {
      slots.push(format(current, "HH:mm"));
      current = addMinutes(current, timeSlotInterval);
    }
    return slots;
  };

  const handleSubmit = async (values: ReservationFormValues) => {
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/reservations", values);

      toast({
        description: "Reservation confirmed! Check your email for details.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to make reservation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                {...form.register("date")}
                min={format(new Date(), "yyyy-MM-dd")}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Party Size</label>
              <Input
                type="number"
                {...form.register("partySize", { valueAsNumber: true })}
                min={1}
                max={maxPartySize}
              />
              {form.formState.errors.partySize && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.partySize.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              {...form.register("name")}
              placeholder="Your name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              {...form.register("email")}
              placeholder="your@email.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              {...form.register("phone")}
              placeholder="Your phone number"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Confirming..." : "Make Reservation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
