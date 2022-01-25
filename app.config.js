const env = process.env.APP_VARIANT;

export default {
  name: getAppName(),
  slug: getSlug(),
  version: "1.0.13",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  jsEngine: "hermes",
  sdkVersion: "44.0.0",
  scheme: getAppIdentifier(),
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
    versionCode: 13,
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#FFFFFF"
    }
  }
}

function getAppName() {
  if (env === "development") {
    return "Cashingames Dev";
  } else if (env === "preview") {
    console.log("here")
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

function isTrue(value) {
  return value != "" && value !== undefined && value !== null
}
