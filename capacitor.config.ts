
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.forkful.app',
  appName: 'Forkful',
  webDir: 'dist',
  server: {
    url: 'https://1471ef58-a231-4936-aa6e-cdfbc423b482.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FF8C42",
      androidSplashResourceName: "splash",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
      splashImmersive: true,
      splashFullScreen: true
    },
    CapacitorCookies: {
      enabled: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#FF8C42", // Matching the app logo's orange color
    allowBackup: true
  }
};

export default config;
