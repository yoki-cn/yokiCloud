// postcss.config.mjs
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    autoprefixer
  ]
};

export default config;
