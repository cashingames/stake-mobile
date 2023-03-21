import { useSelector } from "react-redux";
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from "../utils/utils";
import Constants from 'expo-constants';


export default function RenderUpdateChecker () {
    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);

    if (minVersionCode && Constants.expoConfig.extra.isDevelopment !== "true") {
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }

    notifyOfPublishedUpdates();

    return null;

}
    



