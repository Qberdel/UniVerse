import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function readApiBaseUrlFromFile() {
  const configPath = path.resolve(__dirname, 'url.txt')
  const fileContent = fs.readFileSync(configPath, 'utf-8')
  const firstLine = fileContent.split(/\r?\n/)[0]?.trim() ?? ''
  if (!firstLine) {
    throw new Error('url.txt: первая строка пустая')
  }

  // Поддерживаем формат KEY=VALUE для удобного расширения файла констант.
  const [key, ...rest] = firstLine.split('=')
  if (rest.length > 0 && key.trim().length > 0) {
    return rest.join('=').trim().replace(/\/+$/, '')
  }

  return firstLine.replace(/\/+$/, '')
}

const apiBaseUrl = readApiBaseUrlFromFile()

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __API_BASE_URL__: JSON.stringify(apiBaseUrl),
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
