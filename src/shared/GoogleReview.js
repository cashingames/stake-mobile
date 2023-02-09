import { Platform } from 'react-native'
import InAppReview from 'react-native-in-app-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_REVIEW = "APP::GOOGLE_REVIEW"

export const PopGoogleReviewLogic = async (gameCount)=>{
    // check if feature is available on device
    if( !(InAppReview.isAvailable()) ) return false;

    // check if platform is android
    if( Platform.OS !== 'android' ) return false;

    // check if gameCount isn't zero
    if( parseInt(gameCount) !== 0 ) return false;

    // check if pop up has been displayed before
    const hasReviewed = await GetStampReview()
    if(hasReviewed) return false;

    // show review :: return true on android
    const isReviewed = await InAppReview.RequestInAppReview();

    if(isReviewed){
        // store state 
        await StampReview()

        return true;
    }else{
        // ios only:: ignore for now
        await StampReview()

        return false;
    }
}

const GetStampReview = async ()=>{
    const reviewed = await AsyncStorage.getItem(GOOGLE_REVIEW);

    if(reviewed == null){
        return false;
    }else{
        return true;
    }


}

const StampReview = async ()=>{
    await AsyncStorage.setItem(GOOGLE_REVIEW, JSON.stringify({
        hasReview: true,
        date: (new Date()).getTime()
    }))
}