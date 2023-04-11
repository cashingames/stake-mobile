const env = process.env.APP_VARIANT;
const isDevelopment = env === 'development' || env === 'local' || false;

const version = "1.1.23"; //Update for every build and publish

// Reminder: android is still on 1.1.14 @ 13 march, 2023

export default {
  name: getAppName(),
  slug: getSlug(),
  version: version,
  runtimeVersion: "1.23", //All apps using the same runtime will get the published updates. Generally update for every new build
  icon: "./assets/images/adaptive-icon2.png",
  jsEngine: "hermes",
  scheme: "gameark",
  splash: {
    image: "./assets/images/splash-GA.png",
    resizeMode: "cover",
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
    googleServicesFile: getAndroidGoogleServices(),
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
            "path": "/gameark"
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
    googleServicesFile: getIosGoogleServices(),
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics",
    "expo-notifications",
    "./plugins/withAndroidNamespace",
    [
      "expo-build-properties",
      {
        "android": {
          "enableProguardInReleaseBuilds": true,
          "enableDangerousExperimentalLeanBuilds": true
        },
        "ios": {
          "useFrameworks": "static"
        }
      }
    ],
    [
      "react-native-fbsdk-next",
      {
        "appID": "401438355501146",
        "clientToken": "9762cebc572b557561423a9d6b1d9000",
        "displayName": "Cashingames",
      }
    ]
  ],
  extra: {
    isDevelopment: isDevelopment,
    isProduction: env === 'production' || false,
    isStaging: isDevelopment || env === "preview",
    googleAndriodClientId: getGoogleAndroidClientId(),
    googleIosClientId: getGoogleIosClientId(),
    gaTrackingID: getGATrackingID(),
    paystackKey: getPaystackKey(),
    apiBaseUrl: getApiUrl(),
    stakingAppUrl: getStakingAppUrl(),
    appDomain: getDomain(),
    assetBaseUrl: getAssetsBaseUrl(),
    eas: {
      projectId: getEasProjectId()
    }
  },
}

function getAndriodVersionCode() {
  const _v = version.split(".");
  return Number(_v[_v.length - 1]);
}

function getAppName() {
  if (isDevelopment) {
    return "GameArk Dev";
  } else if (env === "preview") {
    return "GameArk Test";
  } else {
    return "GameArk";
  }
}

function getSlug() {
  return "game-ark";
}

function getAppIdentifier() {
  let identifier = "gameark";
  if (isDevelopment) {
    identifier = "gamearkdev";
  } else if (env === "preview") {
    identifier = "gamearktest";
  }

  return `com.cashingames.${identifier}`;
}

function getIosIdentifier() {
  let identifier = "gameark";
  if (isDevelopment) {
    identifier = "gamearkdev";
  } else if (env === "preview") {
    identifier = "gamearktest";
  }

  return `com.cashinga.${identifier}`;
}

function getIosGoogleServices() {
  let services = "./GoogleService-Info.plist";
  if (isDevelopment) {
    services = "./GoogleService-Info-com.cashinga.dev.plist";
  } else if (env === "preview") {
    services = "./GoogleService-Info-com.cashinga.test.plist";
  }

  return services;
}

function getAndroidGoogleServices() {
  let services = "./google-services.json";
  if (isDevelopment) {
    services = "./google-services-dev.json";
  } else if (env === "preview") {
    services = "./google-services-test.json";
  }

  return services;
}

function getGATrackingID() {
  if (isDevelopment || env === "preview") {
    return 'UA-173622310-2';
  }

  return 'UA-173622310-1'
}

function getPaystackKey() {
  if (isDevelopment || env === "preview") {
    return 'pk_test_965f5765e86ccbbf918507efddf3b87eeed1ede8';
  }

  return 'pk_live_2d9dd66f608599b9a17847de55759f731a3c9b3b'
}

function getApiUrl() {
  switch (env) {
    case "local":
      return 'http://172.20.10.3:8000/api';
    case "development":
    case "preview":
      return 'https://stg-api.cashingames.com/api';
    default:
      return 'https://api.cashingames.com/api';
  }
}

function getStakingAppUrl() {
  switch (env) {
    case "local":
      return 'http://192.168.42.202:3000/authenticate';
    case "development":
    case "preview":
      return 'https://stake-stg.cashingames.com/authenticate';
    default:
      return 'https://stake.cashingames.com/authenticate';
  }
}

function getDomain() {
  if (isDevelopment || env === "preview") {
    return 'https://stg.cashingames.com';
  }

  return 'https://www.cashingames.com'
}

function getAssetsBaseUrl() {
  if (isDevelopment || env === "preview") {
    return 'https://stg-api.cashingames.com';
  }

  return 'https://api.cashingames.com';
}

function getGoogleAndroidClientId() {
  if (isDevelopment) {
    return '523361815719-dl9tg9sh0ndmplil4o7rov15eoeosqfg.apps.googleusercontent.com';
  }

  if (env === "preview") {
    return '311405879136-h58qd7sgnho0aghbi2e2epvvhhl6t1a7.apps.googleusercontent.com';
  }

  return '300193059462-2ggl088n45irfm7tv76pefv9d6luih0f.apps.googleusercontent.com';
}

function getGoogleIosClientId() {
  if (isDevelopment) {
    return '523361815719-747pq0sqrncgac4ohubgqj9q2cqinbps.apps.googleusercontent.com';
  }

  if (env === "preview") {
    return '311405879136-l74suuo7et5b3ervpadn73d5osq22em2.apps.googleusercontent.com';
  }

  return '300193059462-okf0uiotuhpjqavuoqsnstad14apfi4r.apps.googleusercontent.com';
}

function getEasProjectId() {
  return "52e97a03-c16a-4967-a536-1b53e1cd7b8c";
}