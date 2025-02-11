module.exports = {
  sourceDir: './dist/chrome',
  artifactsDir: './dist/artifacts/chrome',
  ignoreFiles: ['**/*.map'],
  run: {
    target: ['chromium'],
    startUrl: [
      'https://archiveofourown.org/',
      'https://archiveofourown.gay/',
      'chrome://extensions/',
      'chrome://inspect/#extensions',
    ],
  },
  build: {
    overwriteDest: true,
  },
}
