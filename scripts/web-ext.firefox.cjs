module.exports = {
  sourceDir: './dist/firefox',
  artifactsDir: './dist/artifacts/firefox',
  ignoreFiles: ['**/*.map'],
  run: {
    target: ['firefox-desktop'],
    firefox: 'firefox-developer-edition',
    firefoxProfile: 'development',
    keepProfileChanges: true,
    startUrl: [
      'https://archiveofourown.org/',
      'https://archiveofourown.gay/',
      'about:debugging#/runtime/this-firefox',
      'about:addons',
    ],
    pref: [
      `extensions.webextensions.base-content-security-policy.v3=script-src 'self' 'wasm-unsafe-eval' http://localhost:* http://127.0.0.1:*; object-src 'self';`,
      `extensions.webextensions.default-content-security-policy.v3=script-src 'self' 'wasm-unsafe-eval' http://localhost:* http://127.0.0.1:*; object-src 'self';`,
    ],
  },
  build: {
    overwriteDest: true,
  },
}
