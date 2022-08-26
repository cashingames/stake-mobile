# mobile-js


Publish updates with  release-channels https://docs.expo.dev/distribution/release-channels/
Build standalone apps with profiles which already have release channels set in eas.json`

## Release-Deployment Process
Depending on the kind of changes that have been made to the code base, deployment can be of two types, namely:
* Automatic (Over The Air) updates
* Manual store updates

### Manual updates
For changes in codebase to warrant a manual deployment update, the following conditions must have happened:
1. Changes have been made to the `package.json` file. E.g when a new package is installed or updated.
2. Changes to the `app.config.js` file
3. Changes to any of `eas.json`, `firebase.json`, `google-services.json` and `GoogleService-Info.plist` files.

#### Steps to take for Manual Updates
1. Bump `version` number and runtimeVersion version. At this point, the version and runtimeVersion numbers should be matching.
Example: If previous version number is `1.0.50` and runtimeVersion is `1.48`, the bumped version number should be `1.0.51` while runtimeVersion becomes `1.51`.
2. Create a new build by running `yarn build-prod`
3. Download the generated app bundle bundle(.aab) build file.
4. Login to Google Play Console and submit as a new release.

> **Note:** If the updates in the newly generated build contains critical features/fixes that all users should have, the `MIN_CODE_VERSION` environment variable on the server should be updated to match the version number of the newly deployed build.
>> **N.B:** This `MIN_CODE_VERSION` should only be updated once Google Play Console marks the new submission as Approved.
This will force all current app users to go to playstore to get the new update.

### Automatic Updates
If none of the conditions listed for manual updates was met, we can safely publish an automatic over-the-air update to all users on the existing `runtimeVersion`.

#### Steps to take for Over The Air(OTA) Updates
1. Bump the version number; leaving the runtimeVersion intact.
2. Run `yarn publish-prod`


