import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Order } from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.auction_id || !orderData.buyer_id || !orderData.seller_id || !orderData.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder: Order = {
      auction_id: orderData.auction_id,
      buyer_id: orderData.buyer_id,
      seller_id: orderData.seller_id,
      amount: orderData.amount,
      status: 'pending',
      duration_minutes: orderData.duration_minutes || 60,
      notes: orderData.notes || '',
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select();

    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Update auction status to completed
    const { error: auctionError } = await supabase
      .from('auctions')
      .update({ status: 'completed' })
      .eq('id', orderData.auction_id);

    if (auctionError) {
      console.error('Error updating auction status:', auctionError);
      // Continue with order creation even if auction update fails
    }

    return NextResponse.json(data[0], { status: 201 });
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
    const userId = url.searchParams.get('user_id');
    const auctionId = url.searchParams.get('auction_id');
    const status = url.searchParams.get('status');
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        auction:auctions(title, description, service_type, delivery_method),
        buyer:profiles!buyer_id(display_name, email, avatar_url),
        seller:profiles!seller_id(display_name, email, avatar_url)
      `);
    
    if (userId) {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }
    
    if (auctionId) {
      query = query.eq('auction_id', auctionId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
