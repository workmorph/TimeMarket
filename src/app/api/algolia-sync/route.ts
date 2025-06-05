import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  syncAuctionToAlgolia, 
  syncExpertToAlgolia, 
  removeFromAlgolia,
  configureAlgoliaIndexes 
} from '@/lib/search/algolia-client';

// This endpoint should be called by Supabase webhooks
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, table, record, old_record } = await request.json();

    switch (table) {
      case 'auctions':
        if (type === 'INSERT' || type === 'UPDATE') {
          await syncAuctionToAlgolia(record);
        } else if (type === 'DELETE') {
          await removeFromAlgolia('auctions', old_record.id);
        }
        break;

      case 'users':
        // Only sync users who are experts
        if (record?.is_expert && (type === 'INSERT' || type === 'UPDATE')) {
          await syncExpertToAlgolia(record);
        } else if (type === 'DELETE' && old_record?.is_expert) {
          await removeFromAlgolia('experts', old_record.id);
        }
        break;

      default:
        console.log(`No Algolia sync configured for table: ${table}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Algolia sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Algolia' },
      { status: 500 }
    );
  }
}

// Manual sync endpoint for initial data import
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Configure indexes first
    await configureAlgoliaIndexes();

    // Sync all active auctions
    const { data: auctions, error: auctionsError } = await supabase
      .from('auctions')
      .select('*')
      .eq('status', 'active');

    if (auctionsError) {
      throw auctionsError;
    }

    for (const auction of auctions || []) {
      await syncAuctionToAlgolia(auction);
    }

    // Sync all experts
    const { data: experts, error: expertsError } = await supabase
      .from('users')
      .select('*')
      .eq('is_expert', true);

    if (expertsError) {
      throw expertsError;
    }

    for (const expert of experts || []) {
      await syncExpertToAlgolia(expert);
    }

    return NextResponse.json({
      success: true,
      synced: {
        auctions: auctions?.length || 0,
        experts: experts?.length || 0,
      },
    });
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json(
      { error: 'Failed to perform manual sync' },
      { status: 500 }
    );
  }
}