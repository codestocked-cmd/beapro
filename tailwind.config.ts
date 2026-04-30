import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#E8FF3A',
        'brand-dim': '#C5D932',
        surface: '#111114',
        elevated: '#18181D',
        subtle: '#222228',
        success: '#3AFFA0',
        warning: '#FFB830',
        danger: '#FF4D4D',
        info: '#4D9EFF',
      },
      backgroundColor: {
        base: '#0A0A0C',
        surface: '#111114',
        elevated: '#18181D',
        subtle: '#222228',
      },
      textColor: {
        primary: '#F0F0F5',
        secondary: '#8A8A9A',
        muted: '#505060',
        brand: '#E8FF3A',
      },
      borderColor: {
        default: '#2A2A32',
        strong: '#3D3D4A',
        brand: 'rgba(232,255,58,0.3)',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        brand: '0 0 20px rgba(232,255,58,0.2)',
        inner: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}

export default config
