import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { Capacitor } from '@capacitor/core'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { registerSW } from 'virtual:pwa-register'
import { debugShowCompletion } from './lib/state/gameState.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

// Register service worker for PWA offline support
registerSW({ immediate: true })

// Lock to landscape on native platforms
if (Capacitor.isNativePlatform()) {
  ScreenOrientation.lock({ orientation: 'landscape' })
}

// Debug: type congratulate_me() in browser console to test the completion screen
;(window as any).congratulate_me = debugShowCompletion;

export default app
