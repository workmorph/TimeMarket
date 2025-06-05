import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend-client';
import AuctionBidNotificationEmail from '@/emails/auction-bid-notification';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { type, data } = await request.json();

    switch (type) {
      case 'bid_notification': {
        const { bidderEmail, bidderName, auctionTitle, bidAmount, currentHighBid, auctionEndTime, auctionId } = data;
        
        const auctionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auctions/${auctionId}`;
        
        const result = await sendEmail({
          to: bidderEmail,
          subject: `新しい入札: ${auctionTitle}`,
          react: AuctionBidNotificationEmail({
            bidderName,
            auctionTitle,
            bidAmount,
            currentHighBid,
            auctionEndTime,
            auctionUrl,
          }),
        });

        if (!result.success) {
          throw new Error('Failed to send email');
        }

        return NextResponse.json({ success: true, messageId: result.data?.id });
      }

      case 'auction_end': {
        // TODO: Implement auction end notification
        return NextResponse.json({ success: true });
      }

      case 'outbid': {
        // TODO: Implement outbid notification
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}