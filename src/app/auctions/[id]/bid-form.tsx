"use client";

import { useState } from "react";
import type { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface Auction {
  id: string;
  title: string;
  current_highest_bid: number;
  starting_price: number;
  status: string;
  ends_at: string;
}

interface BidFormProps {
  auction: Auction;
  onPlaceBid?: (amount: number) => Promise<void>;
}

export function BidForm({ auction, onPlaceBid }: BidFormProps): JSX.Element {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState<number>(auction.current_highest_bid + 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10);
    setBidAmount(isNaN(value) ? 0 : value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    // 入札額のバリデーション
    if (bidAmount <= auction.current_highest_bid) {
      setError("現在の最高入札額より高い金額を入力してください");
      return;
    }

    if (!user) {
      router.push("/auth/login?redirect=" + encodeURIComponent(`/auctions/${auction.id}`));
      return;
    }

    if (onPlaceBid) {
      try {
        setIsSubmitting(true);
        await onPlaceBid(bidAmount);
        // 成功したら入札額をリセット
        setBidAmount((prev) => prev + 500);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "入札に失敗しました。もう一度お試しください。"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>入札する</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">現在の最高入札額</span>
            <span className="font-semibold">{formatCurrency(auction.current_highest_bid)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bid-amount" className="block text-sm font-medium mb-1">
                あなたの入札額
              </label>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={handleBidChange}
                min={auction.current_highest_bid + 1}
                step={100}
                disabled={isSubmitting}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                最低入札額: {formatCurrency(auction.current_highest_bid + 1)}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || authLoading || bidAmount <= auction.current_highest_bid}
            >
              {isSubmitting ? "処理中..." : "入札する"}
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>入札後のキャンセルはできません</span>
        </div>
      </CardFooter>
    </Card>
  );
}
