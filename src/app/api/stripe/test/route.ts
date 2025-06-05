import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";

/**
 * Stripe接続テスト用API
 */
export async function GET() {
  try {
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        {
          status: "error",
          message: "Stripe is not configured or disabled",
          details: {
            STRIPE_ACCOUNT_ACTIVE: process.env.STRIPE_ACCOUNT_ACTIVE,
            STRIPE_SECRET_KEY_EXISTS: !!process.env.STRIPE_SECRET_KEY,
            STRIPE_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          },
        },
        { status: 500 }
      );
    }

    // Stripeアカウント情報を取得してテスト
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      status: "success",
      message: "Stripe connection successful",
      data: {
        account_id: account.id,
        business_profile: account.business_profile,
        capabilities: account.capabilities,
        charges_enabled: account.charges_enabled,
        details_submitted: account.details_submitted,
        payouts_enabled: account.payouts_enabled,
        country: account.country,
        default_currency: account.default_currency,
        type: account.type,
      },
      config: {
        STRIPE_ACCOUNT_ACTIVE: process.env.STRIPE_ACCOUNT_ACTIVE,
        STRIPE_SECRET_KEY_EXISTS: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error: unknown) {
    console.error("Stripe test error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Stripe connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          STRIPE_ACCOUNT_ACTIVE: process.env.STRIPE_ACCOUNT_ACTIVE,
          STRIPE_SECRET_KEY_EXISTS: !!process.env.STRIPE_SECRET_KEY,
          STRIPE_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}
