import { api, cache, options } from '#common'

import './menus.ts'

browser.runtime.onInstalled.addListener(async () => {
  // Run migrations when we install or update extension
  await runMigrations()
})

api.openOptionsPage.addListener(async () => {
  await browser.runtime.openOptionsPage()
})

api.runMigrations.addListener(async () => {
  await runMigrations()
  browser.runtime.reload()
})

async function runMigrations() {
  await import('./migrations.ts').then(({ migrate }) => migrate())
}

if (process.env.NODE_ENV === 'development') {
  // Allow manual testing access to the option and cache object
  ;(globalThis as any).options = options
  ;(globalThis as any).cache = cache
}
