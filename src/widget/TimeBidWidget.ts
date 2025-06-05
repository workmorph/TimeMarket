interface WidgetConfig {
  theme: 'light' | 'dark'
  primaryColor: string
  borderRadius: string
  showLogo: boolean
  customCSS: string
}

interface WidgetOptions {
  container: string | HTMLElement
  config: WidgetConfig
}

class TimeBidWidget {
  private container: HTMLElement
  private config: WidgetConfig

  constructor(options: WidgetOptions) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container) as HTMLElement
      : options.container

    this.config = options.config
    this.render()
  }

  private render(): void {
    if (!this.container) {
      console.error('TimeBid Widget: Container not found')
      return
    }

    this.container.innerHTML = `
      <div class="timebid-widget" style="
        --primary-color: ${this.config.primaryColor};
        --border-radius: ${this.config.borderRadius};
      ">
        ${this.config.showLogo ? '<div class="widget-logo">TimeBid</div>' : ''}
        <div class="widget-content">
          <h3>専門家との時間をオークション</h3>
          <p>あなたに最適な専門家を見つけましょう</p>
          <button class="widget-cta">今すぐ始める</button>
        </div>
        <style>
          ${this.config.customCSS}
        </style>
      </div>
    `

    this.attachEventListeners()
  }

  private attachEventListeners(): void {
    const ctaButton = this.container.querySelector('.widget-cta') as HTMLElement
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        window.open(`${process.env.NEXT_PUBLIC_APP_URL}/auctions`, '_blank')
      })
    }
  }

  static init(config: WidgetConfig): void {
    const containers = document.querySelectorAll('[data-timebid-widget]')
    containers.forEach(container => {
      new TimeBidWidget({ container: container as HTMLElement, config })
    })
  }
}

export default TimeBidWidget
