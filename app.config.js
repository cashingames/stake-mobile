const env = process.env.APP_VARIANT;

export default {
  name: getAppName(),
  slug: "cashingames",
  version: "1.0.3",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  jsEngine: "hermes",
  sdkVersion: "44.0.0",
  scheme: 'cashingames',
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  androidStatusBar: {
    barStyle: "dark-content"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  platforms: [
    "android"
  ],
  android: {
    package: getAppIdentifier(),
    versionCode: 3,
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#FFFFFF"
    }
  },
  extra: {
    environment: process.env.APP_VARIANT,
    isProd: !isTrue(process.env.APP_VARIANT),
    isDev: process.env.APP_VARIANT === 'development',
    isPreview: process.env.APP_VARIANT === 'preview',
    androidClientId: getAndroidClientID()
  },
}

function getAppName() {
  if (env === "development") {
    return "Cashingames Dev";
  } else if (env === "preview") {
    return "Cashingames Test";
  } else {
    return "Cashingames";
  }
}

function getAndroidClientID() {
  if (env === "development") {
    return '125752028373-ik9v848h4d8n8c95bq5lrva1k5anffdo.apps.googleusercontent.com';
  } else if (env === "preview") {
    return "125752028373-f3pls3bjaq22s82p9elsg57bd7bc0kbh.apps.googleusercontent.com";
  } else {
    return "125752028373-mmdihc58hbubpt4obl59875tun5633or.apps.googleusercontent.com";
  }
}


function getAppIdentifier() {
  if (env === "development") {
    return "com.cashingames.dev";
  } else if (env === "preview") {
    return "com.cashingames.test";
  } else {
    return "com.cashingames.cashingames";
  }
}

function isTrue(value) {
  return value != "" && value !== undefined && value !== null
}
