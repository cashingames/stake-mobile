const env = process.env.APP_VARIANT;
console.log(env);
export default {
  name: getAppName(),
  slug: "cashingames",
  version: "1.0.2",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  jsEngine: "hermes",
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
  android: {
    package: getAppIdentifier(),
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#FFFFFF"
    }
  },
  sdkVersion: "44.0.0",
  ios: {
    bundleIdentifier: getAppIdentifier(),
  }
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


function getAppIdentifier() {
  if (env === "development") {
    return "com.cashingames.dev";
  } else if (env === "preview") {
    return "com.cashingames.test";
  } else {
    return "com.cashingames.cashingames";
  }
}