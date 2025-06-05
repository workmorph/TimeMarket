import OpenAI from "openai";

interface PricingSuggestion {
  reserve_price: number;
  confidence: number;
  reasoning: string;
}

interface AuctionData {
  category?: string;
  title: string;
  startingPrice: number;
  description?: string;
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

class PricingEngine {
  private client: OpenAI;
  private systemPrompt: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.systemPrompt = `You are an AI pricing optimization system for TimeBid auction platform.
    Analyze auction data and suggest optimal reserve prices based on:
    - Historical auction performance
    - Market demand patterns
    - Seller/buyer behavior
    - Time sensitivity factors
    
    Return response as JSON: {"reserve_price": number, "confidence": number, "reasoning": string}`;
  }

  async generateReservePrice(auctionData: AuctionData): Promise<PricingSuggestion> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo", // Start with cost-effective model
        messages: [
          { role: "system", content: this.systemPrompt },
          {
            role: "user",
            content: `Analyze this auction data and suggest reserve price:
            ${JSON.stringify(auctionData, null, 2)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI API");
      }
      return JSON.parse(content) as PricingSuggestion;
    } catch (error: unknown) {
      console.error("Pricing API error:", error);
      return this.fallbackPricing(auctionData);
    }
  }

  private fallbackPricing(auctionData: AuctionData): PricingSuggestion {
    // Simple fallback logic if AI fails
    const startingPrice = auctionData.startingPrice;
    const reservePrice = startingPrice * 1.5; // 50% higher than starting price as fallback

    return {
      reserve_price: reservePrice,
      confidence: 0.5,
      reasoning:
        "Fallback pricing used due to API error. Suggested reserve price is 50% higher than starting price.",
    };
  }
}

export default PricingEngine;
