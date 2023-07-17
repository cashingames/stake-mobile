import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';


export default function UpdatesChecker() {
    const route = useRoute();

    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);

    if (minVersionCode && Constants.expoConfig.extra.isDevelopment !== true) {
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }

    console.log("Checking for published updates", Constants.expoConfig.extra.isDevelopment);

    if (Constants.expoConfig.extra.isDevelopment === true) {
        console.log("Skipping published updates check in development mode");
        return null;
    }

    notifyOfPublishedUpdates(route.name);
}