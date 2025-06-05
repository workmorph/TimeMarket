"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ThumbsUp, ThumbsDown, Sparkles, AlertCircle, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AuctionData {
  id?: string;
  title: string;
  description?: string;
  startingPrice: number;
  category?: string;
  duration_minutes?: number;
  service_type?: string;
  delivery_method?: string;
  expert?: {
    id: string;
    display_name: string;
    average_rating?: number;
    total_sessions?: number;
  };
}

interface AIPricingSuggestionProps {
  auctionData: AuctionData;
  onAcceptSuggestion: (reservePrice: number) => void;
}

export function AIPricingSuggestion({ auctionData, onAcceptSuggestion }: AIPricingSuggestionProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    reserve_price: number | null;
    confidence: number | null;
    reasoning: string;
    variant?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);

  const generatePricingSuggestion = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionData,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate pricing suggestion");
      }

      const data = await response.json();
      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate pricing suggestion");
    } finally {
      setIsLoading(false);
    }
  }, [user, auctionData]);

  useEffect(() => {
    if (auctionData.title && auctionData.startingPrice > 0 && user) {
      generatePricingSuggestion();
    }
  }, [auctionData.title, auctionData.startingPrice, user, generatePricingSuggestion]);

  const handleAcceptSuggestion = () => {
    if (suggestion?.reserve_price) {
      onAcceptSuggestion(suggestion.reserve_price);
      setFeedback("positive");
    }
  };

  const handleRejectSuggestion = () => {
    setFeedback("negative");
  };

  // If in manual pricing group or no suggestion yet
  if (!suggestion || suggestion.variant === "manual_pricing") {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
            AIによる最適価格提案
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100">
            ベータ版
          </Badge>
        </div>
        <CardDescription>
          あなたのオークションデータを分析し、最適な予約価格を提案します
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
            <span>AIが最適な価格を計算中...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">提案された予約価格</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(suggestion.reserve_price || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  信頼度
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">
                          AIがこの価格提案にどれだけ自信を持っているかを示します。高いほど、より多くのデータに基づいた提案です。
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(suggestion.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((suggestion.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">AIの分析</span>
                <p className="text-sm mt-1 bg-white p-3 rounded-md border">
                  {suggestion.reasoning}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {!isLoading && !error && suggestion?.reserve_price && !feedback && (
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectSuggestion}
            className="text-gray-600"
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            使用しない
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptSuggestion}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            この価格を使用
          </Button>
        </CardFooter>
      )}

      {feedback === "positive" && (
        <CardFooter className="pt-2">
          <p className="text-sm text-green-600 flex items-center w-full justify-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            提案された価格を適用しました
          </p>
        </CardFooter>
      )}

      {feedback === "negative" && (
        <CardFooter className="pt-2">
          <p className="text-sm text-gray-600 flex items-center w-full justify-center">
            フィードバックありがとうございます
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
