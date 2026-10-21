import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'

const pages = readdirSync(import.meta.dirname, { recursive: true })
  .filter((file) => basename(file) === 'index.html')
  .filter((file) => !/^(node_modules|dist|public|studio|nextjs)[\\/]/.test(file))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: pages.map((file) => resolve(import.meta.dirname, file)),
    },
  },
})




// import { readdirSync } from 'node:fs'
// import { resolve, basename } from 'node:path'
// These load two built-in Node tools. readdirSync lists the files in a folder.
// basename takes the last part of a path, so work/migration/index.html becomes index.html.

// const pages = readdirSync(import.meta.dirname, { recursive: true })

// This lists every file in your project, including files inside subfolders. 
// That’s what recursive: true does. import.meta.dirname means “the folder this config file is in”, the same thing your current lines use.

//   .filter((file) => basename(file) === 'index.html')

// This keeps only the files named index.html, which are your pages, and throws away everything else (images, CSS and so on).

//   .filter((file) => !/^(node_modules|dist|public|studio|nextjs)[\\/]/.test(file))

// This removes pages from folders that shouldn’t be built. The odd-looking part is a pattern that means “starts with one of these folder names”. 
// node_modules holds installed packages, dist is the build output, and studio is your Sanity setup. 
// I added nextjs because I’m guessing that folder isn’t part of the live site. My first version would have built it.

//   input: pages.map((file) => resolve(import.meta.dirname, file)),

// This turns each found page into a full path, just like your resolve(...) lines do, and hands the list to Vite.



// OLD CODE I HAD TO MANUALLY PUT THOSE IN.

// export default defineConfig({
//   plugins: [tailwindcss()],

//   input: {
//      import.meta.dirname means “the folder this config file is in”
//     home: resolve(import.meta.dirname, "index.html"),
//     designBranding: resolve(import.meta.dirname,"work/design-branding/index.html", ),
//     designComponents: resolve(import.meta.dirname,"work/design-components/index.html",),
//     migration: resolve(import.meta.dirname, "work/migration/index.html"),
//     work: resolve(import.meta.dirname, "work/index.html"),
//     journal: resolve(import.meta.dirname, "journal/index.html"),
//     about: resolve(import.meta.dirname, "about/index.html"),
//   },
// });