import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'], // Capitalized Montserrat
      },
      width: {
        'custom-half': 'calc(50% - 20px)', // Adjust 20px according to your gap calculation
        'laptop': '1140px', // 1140px size screen
        'custom-third': 'calc(33% - 20px)', // Example customization
        'custom-fourth': 'calc(25% - 6px)', // Example customization
        'fixed-half-lg': 'calc(1024px / 2 - 20px)', // Example customization
        'laptop-half-gap': 'calc(1140px / 2 - 20px)', // Example customization
        'laptop-third-gap': 'calc(1140px / 3 - 20px)', // Example customization
      },
      minWidth: {
        'custom-half': 'calc(50% - 20px)', // Example customization
        'custom-third': 'calc(33% - 20px)', // Example customization
        'custom-fourth': 'calc(25% - 20px)', // Example customization
        'laptop-third-gap': 'calc(1140px / 3 - 20px)', // Example customization
        'laptop': '1140px', // 1140px size screen
        'fixed-half-lg': 'calc(1024px / 2 - 20px)', // Example customization
        'laptop-half-gap': 'calc(1140px / 2 - 20px)', // Example customization

      },
      maxWidth: {
        'custom-half': 'calc(50% - 20px)', // Example customization
        'custom-third': 'calc(33% - 20px)', // Example customization
        'custom-fourth': 'calc(25% - 20px)', // Example customization
        'laptop': '1140px', // 1140px size screen
        'fixed-half-lg': 'calc(1024px / 2 - 20px)', // Example customization
        'laptop-half-gap': 'calc(1140px / 2 - 20px)', // Example customization
        'laptop-third-gap': 'calc(1140px / 3 - 20px)', // Example customization

      },

      backgroundColor: {
        'custom-background': '#F9F9F9',
        'custom-hero': '#EEF0FE',
        'primary-faded': '#EEF0FE',
      },

      backgroundImage: {
        'carvideo': "url('img/carbgvid.mp4')",
      },


      borderWidth: {
        'border': '1px', // Custom border width
      },
      borderColor: {
        'border': '#E1E1E1', // Custom border color
      },
    },
  },
  plugins: [],
};
export default config;
