/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        content: '1024px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cosmic: {
          light: "#F8FAFC",
          lightGray: "#F1F5F9",
          purple: "#8B5CF6",
          deepPurple: "#7C3AED",
          brightPurple: "#A855F7",
          indigo: "#6366F1",
          neonBlue: "#0EA5E9",
          neonPink: "#EC4899",
          neonPurple: "#8B5CF6",
          accent: "#059669",
          glow: "#8B5CF6",
          dark: "#1E293B",
          gray: "#64748B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        future: ['Orbitron', 'sans-serif'],
        tech: ['Rajdhani', 'monospace'],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        'bg-head-halving': "url('/images/bg_head_halving.jpg')",
        'cosmic-gradient': 'linear-gradient(to right, #F8FAFC, #E2E8F0, #F8FAFC)',
        'cosmic-radial': 'radial-gradient(circle, #E2E8F0 0%, #F8FAFC 100%)',
        'neon-glow': 'linear-gradient(to right, #059669, #0EA5E9)',
        'purple-glow': 'linear-gradient(to right, #8B5CF6, #A855F7)',
        'grid-pattern': 'linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
      },
    },
    lineClamp: {
      2: '2', // 设置最大显示的行数
      // 可根据需要添加更多的行数配置
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
      },
      glow: {
        '0%, 100%': { filter: 'brightness(1)' },
        '50%': { filter: 'brightness(1.3)' },
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
      orbit: {
        '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
        '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
      float: 'float 6s ease-in-out infinite',
      pulse: 'pulse 3s ease-in-out infinite',
      glow: 'glow 2s ease-in-out infinite',
      spin: 'spin 30s linear infinite',
      'spin-slow': 'spin 50s linear infinite',
      orbit: 'orbit 20s linear infinite',
    },
  },
  variants: {
    extend: {
      lineClamp: ['responsive'], // 扩展 lineClamp 变体
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // 引入 line-clamp 插件
    // ...
  ],
}
