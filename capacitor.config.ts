import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cellquest.app',
  appName: 'Cell Quest',
  webDir: 'dist',
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    ScreenOrientation: {
      // Landscape lock handled in app code + AndroidManifest
    },
  },
};

export default config;
