import fs from 'fs'

fs.copyFileSync('manifest.json', 'dist/manifest.json')
fs.copyFileSync('src/background.js', 'dist/background.js')
