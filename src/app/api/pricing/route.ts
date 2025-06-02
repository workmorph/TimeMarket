import { NextRequest, NextResponse } from 'next/server';
import PricingEngine from '@/services/pricing/PricingEngine';
import { supabase } from '@/lib/supabase';
import ABTestingFramework from '@/services/experiments/ABTestingFramework';

// Initialize the pricing engine and A/B testing framework
const pricingEngine = new PricingEngine();
const abTestingFramework = new ABTestingFramework();

// Create experiment for AI pricing vs manual pricing
const AI_PRICING_EXPERIMENT = 'ai_pricing_vs_manual';
abTestingFramework.createExperiment(
  AI_PRICING_EXPERIMENT,
  ['ai_pricing', 'manual_pricing'],
  { 'ai_pricing': 50, 'manual_pricing': 50 }
);

export async function POST(request: NextRequest) {
  try {
    const { auctionData, userId } = await request.json();
    
    // Validate required fields
    if (!auctionData || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Assign user to experiment variant
    const variant = abTestingFramework.assignVariant(userId, AI_PRICING_EXPERIMENT);
    
    // If user is in manual pricing group, return without AI suggestion
    if (variant === 'manual_pricing') {
      return NextResponse.json({
        reserve_price: null,
        confidence: null,
        reasoning: "Manual pricing selected",
        variant
      });
    }

    // Generate AI pricing suggestion
    const pricingSuggestion = await pricingEngine.generateReservePrice(auctionData);
    
    // If auctionId is provided, store the suggestion in the database
    if (auctionData.id) {
      const { error } = await supabase
        .from('auctions')
        .update({
          ai_suggested_reserve: pricingSuggestion.reserve_price,
          ai_confidence_score: pricingSuggestion.confidence,
          ai_reasoning: pricingSuggestion.reasoning
        })
        .eq('id', auctionData.id);

      if (error) {
        console.error('Error updating auction with AI suggestion:', error);
      }
    }

    return NextResponse.json({
      ...pricingSuggestion,
      variant
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const auctionId = url.searchParams.get('auction_id');
    
    if (!auctionId) {
      return NextResponse.json(
        { error: 'Missing auction_id parameter' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('auctions')
      .select('ai_suggested_reserve, ai_confidence_score, ai_reasoning')
      .eq('id', auctionId)
      .single();

    if (error) {
      console.error('Error fetching AI pricing suggestion:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI pricing suggestion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reserve_price: data.ai_suggested_reserve,
      confidence: data.ai_confidence_score,
      reasoning: data.ai_reasoning
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
