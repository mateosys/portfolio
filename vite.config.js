import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'node:path'

export default defineConfig({
  plugins: [tailwindcss()],


  input: {
    home: resolve(import.meta.dirname, 'index.html'),
    designBranding: resolve(import.meta.dirname, 'work/design-branding/index.html'),
    designComponents: resolve(import.meta.dirname, 'work/design-components/index.html'),
    migration: resolve(import.meta.dirname, 'work/migration/index.html'),
    work: resolve(import.meta.dirname, 'work/index.html'),
    journal: resolve(import.meta.dirname, 'journal/index.html'),
    about: resolve(import.meta.dirname, 'about/index.html'),
  },
})
