const env = process.env.APP_VARIANT;
console.log(env);
export default {
  name: getAppName(),
  slug: "cashingames",
  version: "1.0.3",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  jsEngine: "hermes",
  sdkVersion: "44.0.0",
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
  expo: {
    scheme: 'cashingames'
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