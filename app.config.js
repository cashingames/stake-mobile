const env = process.env.APP_VARIANT;

export default {
  name: getAppName(),
  slug: getSlug(),
  version: "1.0.27",
  orientation: "portrait",
  icon: "./assets/images/adaptive-icon2.png",
  // jsEngine: "hermes",
  sdkVersion: "44.0.0",
  scheme: "cashingames",
  splash: {
    image: "./assets/images/splash2.png",
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
    "android",
    "ios"
  ],
  android: {
    package: getAppIdentifier(),
    versionCode: 26,
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon2.png",
      backgroundColor: "#FFFFFF"
    }
  },
  ios: {
    bundleIdentifier: getAppIdentifier(),
    googleServicesFile: "./GoogleService-Info.plist",
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics",
  ],
  extra: {
    isDevelopment: env === 'development' || false,
    isProduction: !isTrue(env),
    isPreview: env === 'preview' || false,
    socialLoginClientID: getSocialLoginClientID(),
    gaTrackingID: getGATrackingID(),
    paystackKey: getPaystackKey(),
    apiBaseUrl: getApiUrl(),
    appDomain: getDomain(),
    assetBaseUrl: getAssetsBaseUrl(),
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

function getSlug() {
  return "cashingames";
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

function getSocialLoginClientID() {
  if (env === "development") {
    return '125752028373-ik9v848h4d8n8c95bq5lrva1k5anffdo.apps.googleusercontent.com';
  } else if (env === "preview") {
    return "125752028373-f3pls3bjaq22s82p9elsg57bd7bc0kbh.apps.googleusercontent.com";
  } else {
    return "125752028373-mmdihc58hbubpt4obl59875tun5633or.apps.googleusercontent.com";
  }
}

function getGATrackingID() {
  if (env === "development" || env === "preview") {
    return 'UA-173622310-2';
  }

  return 'UA-173622310-1'
}

function getPaystackKey() {
  if (env === "development" || env === "preview") {
    return 'pk_test_3ebf811326f87025dafdbe6829bdcbdaf8ebfd84';
  }

  return 'pk_live_cee2bb8cae2f3f0ff16923b581c2bc1460ded991'
}

function getApiUrl() {
  if (env === "development" || env === "preview") {
    return 'https://stg-api.cashingames.com/api';
  }

  return 'https://api.cashingames.com/api'
}

function getDomain() {
  if (env === "development" || env === "preview") {
    return 'https://stg.cashingames.com';
  }

  return 'https://www.cashingames.com'
}

function getAssetsBaseUrl() {
  if (env === "development" || env === "preview") {
    return 'https://stg-api.cashingames.com';
  }

  return 'https://api.cashingames.com';
}

function isTrue(value) {
  return value != "" && value !== undefined && value !== null
}
