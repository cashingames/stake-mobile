import React, { useEffect } from 'react';
import { Text, View, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import AppButton from '../../shared/AppButton';
import { getUser } from '../Auth/AuthSlice';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';

const GameBoostPurchaseSuccessfulScreen = ({ route }) => {
    const params = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <ImageBackground source={require('../../../assets/images/success-background.png')}
            style={{ flex: 1, justifyContent:'center' }}
            resizeMethod="resize">
            <View style={styles.topContainer}>
                <View style={styles.container}>
                    <Text style={styles.paymentHeader}>Payment Successful....</Text>
                    <View style={styles.image}>
                        <Image
                            source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${params.boost_image}` }}
                            style={styles.boostIcon}
                        />
                    </View>
                    <Text style={styles.message}>{params.boost_name} was purchased successfully for NGN {params.boost_price}</Text>
                </View>
                <View style={styles.congratsButtons}>
                    <AppButton text="Okay, got it" onPress={() => navigation.navigate('Home')} style={styles.actionButton} />
                </View>
            </View>
        </ImageBackground>
    )
}
export default GameBoostPurchaseSuccessfulScreen;


const styles = EStyleSheet.create({
    topContainer: {
        paddingHorizontal: responsiveScreenWidth(8),
    },
    container: {
        marginBottom: responsiveScreenWidth(15),
    },
    image: {
        alignItems: 'center',
        marginVertical: normalize(8)
    },
    boostIcon: {
        width: normalize(115),
        height: normalize(115),
    },
    success: {
        width: normalize(65),
        height: normalize(65),
        marginVertical: normalize(10),
    },
    paymentHeader: {
        fontFamily: 'gotham-bold',
        fontSize: '1.5rem',
        textAlign: 'center',
        color: '#1C453B',
    },
    message: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        textAlign: 'center',
        color: '#1C453B',
        lineHeight: '1.6rem',
    },
    congratsButtons: {
 
    },
    actionButton: {
        marginTop: normalize(5),
    },
});
