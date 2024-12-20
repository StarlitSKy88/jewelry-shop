interface FontConfig {
  family: string;
  url: string;
  weight?: string | number;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

class FontLoader {
  private loadedFonts: Set<string> = new Set();
  private loadingFonts: Set<string> = new Set();

  public async loadFont(config: FontConfig): Promise<void> {
    const { family, url, weight = 'normal', style = 'normal', display = 'swap' } = config;
    const fontKey = `${family}-${weight}-${style}`;

    if (this.loadedFonts.has(fontKey) || this.loadingFonts.has(fontKey)) {
      return;
    }

    this.loadingFonts.add(fontKey);

    try {
      const font = new FontFace(family, `url(${url})`, {
        weight: weight.toString(),
        style,
        display,
      });

      const loadedFont = await font.load();
      document.fonts.add(loadedFont);
      this.loadedFonts.add(fontKey);
      this.loadingFonts.delete(fontKey);
    } catch (error) {
      console.error(`Failed to load font: ${family}`, error);
      this.loadingFonts.delete(fontKey);
    }
  }

  public preloadFonts(configs: FontConfig[]): void {
    configs.forEach(config => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = config.url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  public clear(): void {
    this.loadedFonts.clear();
    this.loadingFonts.clear();
  }
}

export const fontLoader = new FontLoader(); 