import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { Capacitor } from '@capacitor/core'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { registerSW } from 'virtual:pwa-register'

const app = mount(App, {
  target: document.getElementById('app')!,
})

// Register service worker for PWA offline support
registerSW({ immediate: true })

// Lock to landscape on native platforms
if (Capacitor.isNativePlatform()) {
  ScreenOrientation.lock({ orientation: 'landscape' })
}

export default app
