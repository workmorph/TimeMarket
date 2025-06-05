import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AuctionBidNotificationEmailProps {
  bidderName: string;
  auctionTitle: string;
  bidAmount: number;
  currentHighBid: number;
  auctionEndTime: string;
  auctionUrl: string;
}

export const AuctionBidNotificationEmail = ({
  bidderName,
  auctionTitle,
  bidAmount,
  currentHighBid,
  auctionEndTime,
  auctionUrl,
}: AuctionBidNotificationEmailProps) => {
  const previewText = `新しい入札がありました: ${auctionTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>新しい入札のお知らせ</Heading>
          
          <Text style={text}>
            こんにちは、{bidderName}さん
          </Text>
          
          <Text style={text}>
            「{auctionTitle}」のオークションに新しい入札がありました。
          </Text>

          <Section style={bidSection}>
            <Text style={bidLabel}>入札額:</Text>
            <Text style={bidAmount}>¥{bidAmount.toLocaleString()}</Text>
            
            <Text style={bidLabel}>現在の最高入札額:</Text>
            <Text style={currentBid}>¥{currentHighBid.toLocaleString()}</Text>
          </Section>

          <Text style={text}>
            オークション終了時刻: {new Date(auctionEndTime).toLocaleString('ja-JP')}
          </Text>

          <Section style={buttonContainer}>
            <Button
              style={button}
              href={auctionUrl}
            >
              オークションを確認する
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            このメールは TimeBid からの自動送信メールです。
            <br />
            配信停止をご希望の場合は、
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications`} style={link}>
              こちら
            </Link>
            から設定を変更してください。
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AuctionBidNotificationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '16px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
};

const bidSection = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '16px 48px',
  padding: '24px',
};

const bidLabel = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
};

const bidAmount = {
  color: '#333',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '36px',
  margin: '0 0 16px 0',
};

const currentBid = {
  color: '#666',
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '28px',
  margin: '0',
};

const buttonContainer = {
  padding: '32px 48px',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};