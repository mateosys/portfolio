import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'node:path'

export default defineConfig({
  plugins: [tailwindcss()],


  input: {
    home: resolve(import.meta.dirname, 'index.html'),
    projectOne: resolve(import.meta.dirname, 'work/proj1/index.html'),
    projectTwo: resolve(import.meta.dirname, 'work/proj2/index.html'),
    projectThree: resolve(import.meta.dirname, 'work/proj3/index.html'),
  },
})
