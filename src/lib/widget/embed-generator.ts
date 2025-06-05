interface WidgetConfig {
  theme: 'light' | 'dark'
  primaryColor: string
  borderRadius: string
  showLogo: boolean
  customCSS: string
}

export const generateEmbedCode = (config: WidgetConfig): string => {
  return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL}/widget/embed.js';
    script.async = true;
    script.onload = function() {
      TimeBidWidget.init(${JSON.stringify(config, null, 2)});
    };
    document.head.appendChild(script);
  })();
</script>`
}

export const generateStyleSheet = (config: WidgetConfig): string => {
  return `
.timebid-widget {
  --primary-color: ${config.primaryColor};
  --border-radius: ${config.borderRadius};
  ${config.customCSS}
}
  `.trim()
}
