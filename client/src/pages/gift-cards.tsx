import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function GiftCards() {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [giftCardDetails, setGiftCardDetails] = useState<any>(null);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/gift-cards", {
        amount: Number(amount)
      });
      const giftCard = await response.json();
      
      toast({
        title: "Gift Card Created!",
        description: `Your gift card code is: ${giftCard.code}`,
      });
      
      setAmount("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create gift card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkBalance = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", `/api/gift-cards/${code}`);
      const giftCard = await response.json();
      setGiftCardDetails(giftCard);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gift card not found.",
      });
      setGiftCardDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", `/api/gift-cards/${code}/redeem`, {
        amount: Number(redeemAmount)
      });
      const giftCard = await response.json();
      
      toast({
        title: "Success!",
        description: `Redeemed ${redeemAmount}. New balance: ${giftCard.balance}`,
      });
      
      setGiftCardDetails(giftCard);
      setRedeemAmount("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to redeem gift card. Please check the amount and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Listed Vegan Gift Cards</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Give the gift of sustainable dining. Our gift cards can be used at any participating
            Listed Vegan restaurant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Purchase Gift Card
              </CardTitle>
              <CardDescription>
                Choose an amount between $10 and $1000
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    max="1000"
                  />
                  <Button 
                    onClick={handlePurchase}
                    disabled={isLoading || !amount || Number(amount) < 10 || Number(amount) > 1000}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Check Balance / Redeem
              </CardTitle>
              <CardDescription>
                Enter your gift card code to check balance or redeem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Gift Card Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                  <Button 
                    onClick={checkBalance}
                    disabled={isLoading || !code}
                  >
                    Check
                  </Button>
                </div>

                {giftCardDetails && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">Balance: ${giftCardDetails.balance}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(giftCardDetails.expiresAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Input
                        type="number"
                        placeholder="Amount to Redeem"
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        min="0"
                        max={giftCardDetails.balance}
                      />
                      <Button
                        onClick={handleRedeem}
                        disabled={
                          isLoading || 
                          !redeemAmount || 
                          Number(redeemAmount) <= 0 || 
                          Number(redeemAmount) > giftCardDetails.balance
                        }
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
