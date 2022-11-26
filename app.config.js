const env = process.env.APP_VARIANT;
const version = "1.2.71"; //Update for every build and publish

export default {
  name: getAppName(),
  slug: getSlug(),
  version: version, 
  runtimeVersion: "2.71", //All apps using the same runtime will get the published updates. Generally update for every new build
  icon: "./assets/images/adaptive-icon2.png",
  jsEngine: "hermes",
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
    versionCode: getAndriodVersionCode(),
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon2.png",
      backgroundColor: "#FFFFFF"
    },
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [
          {
            "scheme": "https",
            "host": "cashingames.com",
            "path": "/cashingames"
          }
        ],
        "category": [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ]
  },
  ios: {
    bundleIdentifier: getIosIdentifier(),
    googleServicesFile: "./GoogleService-Info.plist",
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
    "expo-notifications",
    [
      "expo-build-properties",
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ],
  extra: {
    isDevelopment: env === 'development' || false,
    isProduction: env === 'production' || false,
    isPreview: env === 'preview' || false,
    isStaging: env === "development" || env === "preview",
    googleAndriodClientId: getGoogleAndroidClientId(),
    googleIosClientId: getGoogleIosClientId(),
    gaTrackingID: getGATrackingID(),
    paystackKey: getPaystackKey(),
    apiBaseUrl: getApiUrl(),
    appDomain: getDomain(),
    assetBaseUrl: getAssetsBaseUrl(),
    "eas": {
      "projectId": getEasProjectId()
    }
  },
}

function getAndriodVersionCode() {
  const _v = version.split(".");
  return Number(_v[_v.length - 1]);
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
  let identifier = "cashingames";
  if (env === "development") {
    identifier = "dev";
  } else if (env === "preview") {
    identifier = "test";
  }

  return `com.cashingames.${identifier}`;
}

function getIosIdentifier() {
  let identifier = "cashingames";
  if (env === "development") {
    identifier = "dev";
  } else if (env === "preview") {
    identifier = "test";
  }

  return `com.cashinga.${identifier}`;
}

function getGATrackingID() {
  if (env === "development" || env === "preview") {
    return 'UA-173622310-2';
  }

  return 'UA-173622310-1'
}

function getPaystackKey() {
  if (env === "development" || env === "preview") {
    return 'pk_test_965f5765e86ccbbf918507efddf3b87eeed1ede8';
  }

  return 'pk_live_2d9dd66f608599b9a17847de55759f731a3c9b3b'
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

function getGoogleAndroidClientId() {
  if (env === "development") {
    return '520726557605-n6htks6ao6ge2thkbevhosc0ipk35odr.apps.googleusercontent.com';
  }

  if (env === "preview") {
    return '520726557605-ur6av2djj8oqkhvre58c2fp747p0k41g.apps.googleusercontent.com';
  }

  return '520726557605-pmk80q42pnoteo5gp6j2gan93smdv8o7.apps.googleusercontent.com';
}

function getGoogleIosClientId() {
  if (env === "development") {
    return '520726557605-mls5vke3j0t7lhk5a99em1gsvaml8o2a.apps.googleusercontent.com';
  }

  if (env === "preview") {
    return '520726557605-snc0m31s1m0c059ktoi6gqk01fkvd17g.apps.googleusercontent.com';
  }

  return '520726557605-vftmv5ipp71bk5ffi286t4fevfnkfjah.apps.googleusercontent.com';
}

function getEasProjectId(){
  return "0e946637-631c-4661-a1ca-5f28b92a1e12";
}