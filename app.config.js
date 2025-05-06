import 'dotenv/config';

export default {
  expo: {
    name: '프레이밋',
    slug: 'frame-it',
    version: '0.0.13',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'frameit',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'kr.frameit.frameit',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FF7100',
      },
      package: 'kr.frameit.frameit',
      usesCleartextTraffic: true,
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      webviewUrl: process.env.WEBVIEW_URL,
      apiUrl: process.env.API_URL,
      eas: {
        projectId: '1a797ece-42be-4fe7-a59e-8f41cba293d1',
      },
    },
    owner: 'frameit',
  },
};
