import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createPackage } from '@/models/Package';

export async function POST(request: NextRequest) {
  try {
    const packageData = await request.json();
    
    // Validate required fields
    if (!packageData.seller_id || !packageData.name || !packageData.time_slots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create package with calculated total price
    const newPackage = createPackage({
      seller_id: packageData.seller_id,
      name: packageData.name,
      description: packageData.description || '',
      package_type: packageData.package_type || 'STANDARD',
      time_slots: packageData.time_slots,
      discount_percentage: packageData.discount_percentage || 0,
      is_active: packageData.is_active !== undefined ? packageData.is_active : true,
    });

    // Insert into Supabase
    const { data, error } = await supabase
      .from('packages')
      .insert([newPackage])
      .select();

    if (error) {
      console.error('Error creating package:', error);
      return NextResponse.json(
        { error: 'Failed to create package' },
        { status: 500 }
      );
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
    const sellerId = url.searchParams.get('seller_id');
    
    let query = supabase.from('packages').select('*');
    
    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching packages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
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
