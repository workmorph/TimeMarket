"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' // 現在未使用
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from '@/components/ui/separator' // 現在未使用
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, Info } from "lucide-react";
import Link from "next/link";

export default function WidgetDemoPage() {
  const [apiKey, setApiKey] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3498db");
  const [borderRadius, setBorderRadius] = useState("0.5rem");
  const [fontFamily, setFontFamily] = useState("system-ui, sans-serif");
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // iframeを強制的に再読み込みするためのキー

  // デモコードの生成
  const generateDemoCode = () => {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TimeBid ウィジェットデモ</title>
  <script src="https://cdn.timebid.jp/widget/latest/timebid-widget.js"></script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <h1>TimeBid ウィジェットデモ</h1>
  <p>以下はTimeBidオークションウィジェットのデモです。</p>
  
  <div id="timebid-widget-container"></div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // ウィジェットの初期化
      const widget = TimeBid.createWidget({
        apiKey: '${apiKey || "YOUR_API_KEY"}',
        containerId: 'timebid-widget-container',
        theme: {
          primaryColor: '${primaryColor}',
          fontFamily: '${fontFamily}',
          borderRadius: '${borderRadius}'
        },
        onBidPlaced: function(bid) {
          console.log('入札が行われました:', bid);
        },
        onAuctionEnd: function(auction) {
          console.log('オークションが終了しました:', auction);
        }
      });
    });
  </script>
</body>
</html>`;
  };

  // クリップボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ウィジェットのプレビューを更新
  const updatePreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  // iframeのsrcDoc生成
  const generateIframeSrcDoc = () => {
    return `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
          </style>
        </head>
        <body>
          <div id="timebid-widget-container"></div>
          <script>
            // メッセージ受信ハンドラー
            window.addEventListener('message', function(event) {
              if (event.data && event.data.type === 'TIMEBID_WIDGET_INIT') {
                const config = event.data.config;
                
                // ここでウィジェットをシミュレート
                const container = document.getElementById('timebid-widget-container');
                container.innerHTML = '';
                
                const card = document.createElement('div');
                card.style.border = '1px solid #e2e8f0';
                card.style.borderRadius = config.theme.borderRadius;
                card.style.overflow = 'hidden';
                card.style.fontFamily = config.theme.fontFamily;
                
                const header = document.createElement('div');
                header.style.padding = '1rem';
                header.style.borderBottom = '1px solid #e2e8f0';
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                
                const title = document.createElement('h3');
                title.textContent = 'プレミアムコンサルティング';
                title.style.margin = '0';
                title.style.fontSize = '1.125rem';
                title.style.fontWeight = 'bold';
                
                const badge = document.createElement('span');
                badge.textContent = '残り30分';
                badge.style.backgroundColor = config.theme.primaryColor;
                badge.style.color = 'white';
                badge.style.padding = '0.25rem 0.5rem';
                badge.style.borderRadius = '0.25rem';
                badge.style.fontSize = '0.75rem';
                
                header.appendChild(title);
                header.appendChild(badge);
                
                const content = document.createElement('div');
                content.style.padding = '1rem';
                
                const priceContainer = document.createElement('div');
                priceContainer.style.display = 'flex';
                priceContainer.style.justifyContent = 'space-between';
                priceContainer.style.alignItems = 'center';
                priceContainer.style.marginBottom = '1rem';
                
                const priceLabel = document.createElement('span');
                priceLabel.textContent = '現在価格';
                priceLabel.style.fontSize = '0.875rem';
                priceLabel.style.color = '#64748b';
                
                const price = document.createElement('span');
                price.textContent = '¥25,000';
                price.style.fontSize = '1.25rem';
                price.style.fontWeight = 'bold';
                price.style.color = config.theme.primaryColor;
                
                priceContainer.appendChild(priceLabel);
                priceContainer.appendChild(price);
                
                const separator = document.createElement('hr');
                separator.style.border = 'none';
                separator.style.borderTop = '1px solid #e2e8f0';
                separator.style.margin = '1rem 0';
                
                const infoContainer = document.createElement('div');
                infoContainer.style.fontSize = '0.875rem';
                infoContainer.style.marginBottom = '1rem';
                
                const info1 = document.createElement('div');
                info1.textContent = '60分のセッション';
                info1.style.marginBottom = '0.5rem';
                
                const info2 = document.createElement('div');
                info2.textContent = '開始価格: ¥15,000';
                
                infoContainer.appendChild(info1);
                infoContainer.appendChild(info2);
                
                const form = document.createElement('div');
                form.style.marginTop = '1rem';
                
                const inputContainer = document.createElement('div');
                inputContainer.style.display = 'flex';
                inputContainer.style.gap = '0.5rem';
                inputContainer.style.marginBottom = '0.5rem';
                
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = '¥26,000以上';
                input.style.flex = '1';
                input.style.padding = '0.5rem';
                input.style.border = '1px solid #e2e8f0';
                input.style.borderRadius = '0.25rem';
                
                const button = document.createElement('button');
                button.textContent = '入札する';
                button.style.padding = '0.5rem 1rem';
                button.style.backgroundColor = config.theme.primaryColor;
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '0.25rem';
                button.style.cursor = 'pointer';
                
                inputContainer.appendChild(input);
                inputContainer.appendChild(button);
                
                const hint = document.createElement('p');
                hint.textContent = '※現在価格より1,000円以上高い金額で入札してください';
                hint.style.fontSize = '0.75rem';
                hint.style.color = '#64748b';
                hint.style.margin = '0';
                
                form.appendChild(inputContainer);
                form.appendChild(hint);
                
                const footer = document.createElement('div');
                footer.style.textAlign = 'center';
                footer.style.padding = '0.5rem';
                footer.style.fontSize = '0.75rem';
                footer.style.color = '#64748b';
                footer.style.marginTop = '1rem';
                
                const footerLink = document.createElement('a');
                footerLink.textContent = 'TimeBid';
                footerLink.href = '#';
                footerLink.style.color = config.theme.primaryColor;
                footerLink.style.textDecoration = 'none';
                
                footer.textContent = 'Powered by ';
                footer.appendChild(footerLink);
                
                content.appendChild(priceContainer);
                content.appendChild(separator);
                content.appendChild(infoContainer);
                content.appendChild(form);
                content.appendChild(footer);
                
                card.appendChild(header);
                card.appendChild(content);
                
                container.appendChild(card);
                
                // 親ウィンドウに高さを通知
                window.parent.postMessage({
                  type: 'IFRAME_RESIZE',
                  height: document.body.scrollHeight
                }, '*');
              }
            });
            
            // 親ウィンドウに準備完了を通知
            window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
          </script>
        </body>
      </html>
    `;
  };

  // iframeの高さを調整
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "IFRAME_READY") {
        const iframe = document.getElementById("widget-preview-iframe") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: "TIMEBID_WIDGET_INIT",
              config: {
                apiKey,
                theme: {
                  primaryColor,
                  borderRadius,
                  fontFamily,
                },
              },
            },
            "*"
          );
        }
      } else if (event.data && event.data.type === "IFRAME_RESIZE") {
        const iframe = document.getElementById("widget-preview-iframe") as HTMLIFrameElement;
        if (iframe) {
          iframe.style.height = `${event.data.height}px`;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [apiKey, primaryColor, borderRadius, fontFamily, iframeKey]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">ウィジェットデモ</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>ウィジェット設定</CardTitle>
              <CardDescription>ウィジェットの外観と動作をカスタマイズします</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">APIキー</Label>
                <Input
                  id="api-key"
                  placeholder="tb_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/api-keys" className="text-primary hover:underline">
                    APIキー管理ページ
                  </Link>
                  でAPIキーを作成できます
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-color">メインカラー</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-radius">角丸の半径</Label>
                <Input
                  id="border-radius"
                  placeholder="0.5rem"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">フォント</Label>
                <Input
                  id="font-family"
                  placeholder="system-ui, sans-serif"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={updatePreview}>プレビューを更新</Button>
            </CardFooter>
          </Card>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              このデモページではウィジェットの外観のみをプレビューできます。
              実際のオークション機能を試すには、APIキーを取得して外部サイトに埋め込んでください。
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ウィジェットプレビュー</CardTitle>
              <CardDescription>設定に基づいたウィジェットの外観</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <iframe
                  id="widget-preview-iframe"
                  key={iframeKey}
                  srcDoc={generateIframeSrcDoc()}
                  style={{ width: "100%", height: "400px", border: "none" }}
                  title="Widget Preview"
                  sandbox="allow-scripts allow-same-origin"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>埋め込みコード</CardTitle>
              <CardDescription>
                このコードをあなたのウェブサイトに貼り付けてください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>{generateDemoCode()}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateDemoCode())}
                >
                  {copied ? (
                    <span className="text-green-500 text-xs font-medium">コピーしました</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href="https://docs.timebid.jp/widget" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  ウィジェットドキュメントを見る
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
