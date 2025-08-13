import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 古风主题色彩
        primary: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7916ff',
          700: '#6b04fd',
          800: '#5a03d4',
          900: '#2D1B69', // 主要深紫色
          950: '#1a0f3d',
        },
        gold: {
          50: '#fffdf0',
          100: '#fffadc',
          200: '#fff2b8',
          300: '#ffe685',
          400: '#ffd651',
          500: '#FFD700', // 主要金色
          600: '#e6b800',
          700: '#cc9900',
          800: '#b38600',
          900: '#996f00',
          950: '#805c00',
        },
        ancient: {
          blue: '#1A237E',
          bronze: '#8D6E63',
          ink: '#2c2c2c',
          paper: '#faf9f6',
          scroll: '#f5f2e8',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'chinese': ['SimSun', 'FangSong', 'serif'],
        'title': ['FangSong', 'KaiTi', 'serif'],
      },
      backgroundImage: {
        'gradient-ancient': 'linear-gradient(135deg, #2D1B69 0%, #1A237E 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
        'gradient-scroll': 'linear-gradient(180deg, #f5f2e8 0%, #ede8d3 100%)',
      },
      boxShadow: {
        'ancient': '0 4px 20px rgba(45, 27, 105, 0.3)',
        'gold': '0 4px 20px rgba(255, 215, 0, 0.3)',
        'scroll': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;