import { View, Text } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { ImageBackground } from 'react-native'
import { Image } from 'react-native'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'
import { useRef } from 'react'
import { Animated } from 'react-native'
import { useEffect } from 'react'

const SpecialOffer = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spin = () => {
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                spinValue.setValue(0);
                spin();
            });
        };
        spin();
    }, [spinValue]);

    const spinAnimation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    return (
        <>
            <View style={styles.specialOffer}>
                <View style={styles.specialOfferCase}>
                    <Text style={styles.headerText}>Special Offer</Text>
                </View>
            </View>
            <View style={styles.storeCards}>
                <ImageBackground style={styles.storeItemContainer} source={require('../../../assets/images/store-items-bg.png')}>
                    <Image style={styles.coinIcon} source={require('../../../assets/images/coin-icon.png')} />
                    <Text style={styles.storeItemName}>30 Coins</Text>
                    <View style={styles.boostPriceCase}>
                        <Text style={styles.buyWithCash}>Watch Video</Text>
                    </View>
                </ImageBackground>
                <ImageBackground style={styles.storeItemContainer} source={require('../../../assets/images/store-items-bg.png')}>
                        <Animated.Image style={[styles.giftBox, {transform: [{ rotate: spinAnimation }]}]} source={require('../../../assets/images/free-gift.png')} />
                        <Text style={styles.storeItemName}>Mystery Box</Text>
                        <View style={styles.boostPriceCase}>
                            <Text style={styles.buyWithCash}>200</Text>
                            <Image style={styles.token} source={require('../../../assets/images/token.png')} />
                        </View>
                    </ImageBackground>
            </View>
        </>
    )
}

const styles = EStyleSheet.create({
    specialOffer: {
        flexDirection: 'row',
        backgroundColor: '#2D53A0',
        borderColor: '#FFAA00',
        borderBottomWidth: 4,
        justifyContent: 'center',
        height: 50,
        justifyContent: 'center',
        marginVertical: normalize(20)
    },
    specialOfferCase: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    coinIcon:{
        height:96,
        width:110
    },
    headerText: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '2rem'
    },
    giftBoxCase: {
        alignItems: 'center'
    },
    giftBox: {
        height: normalize(95),
        width: normalize(96)
    },
  
    storeCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // marginTop: normalize(15), 
        justifyContent: 'space-between',
        paddingHorizontal: responsiveScreenWidth(3)
    },
    storeItemContainer: {
        alignItems: 'center',
        marginBottom: normalize(20),
        paddingVertical: responsiveScreenHeight(2),
        justifyContent: 'space-between',
        width: responsiveScreenWidth(45),
        height: 210,
    },
    storeItemName: {
        fontFamily: 'blues-smile',
        fontSize: '1.4rem',
        color: '#fff',
    },
    boostPriceCase: {
        backgroundColor: '#0038B3',
        flexDirection:'row',
        paddingVertical: normalize(4),
        width: responsiveScreenWidth(43.5),
        borderWidth: 2,
        borderColor: '#00EDF1',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyWithCash: {
        fontFamily: 'blues-smile',
        fontSize: '1.2rem',
        color: '#fff',
    },
    token:{
        width:26,
        height:27.5
    }
})
export default SpecialOffer