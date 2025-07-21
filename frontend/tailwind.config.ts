import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Use the 'class' strategy
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
