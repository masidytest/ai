import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/sections/**/*.{ts,tsx,js,jsx}',
    './src/lib/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#a259ff',
        'neon-blue': '#00dbff',
        'futuristic-bg': '#0a0a23',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #a259ff 0%, #00dbff 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px 2px #a259ff, 0 0 40px 4px #00dbff',
      },
    },
  },
  plugins: [],
};

export default config;
