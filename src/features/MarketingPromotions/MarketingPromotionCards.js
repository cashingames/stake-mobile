import React, { useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import SwiperFlatList from "react-native-swiper-flatlist";
import normalize from "../../utils/normalize";
import { useNavigation } from "@react-navigation/native";
import logToAnalytics from "../../utils/analytics";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const MarketingPromotionCards = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);

    const [isNewPromotion, setIsNewPromotion] = useState(true);
    const [isCashDrop, setIsCashDrop] = useState(false);


    const RenderForAndroid = () => {
        const checkAvailablePromotions = () => {
            logToAnalytics("promotions_button_clicked", {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            })
            navigation.navigate('Promotions')
        }
        return (
            <>
                <PromotionsBoard isNewPromotion={isNewPromotion} onPress={checkAvailablePromotions} />
                <CashDropBoards isCashDrop={isCashDrop} />
            </>
        )
    }

    const RenderForIOS = () => {
        const checkAvailablePromotions = () => {
            logToAnalytics("promotions_button_clicked", {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            })
            navigation.navigate('Promotions')
        }
        return (
            <>
                <PromotionsBoard isNewPromotion={isNewPromotion} onPress={checkAvailablePromotions} />
                <CashDropBoards isCashDrop={isCashDrop} />
            </>
        )
    }
    return (
        <View style={styles.leadersContainer}>
            {Platform.OS === 'ios' ? <RenderForIOS /> : <RenderForAndroid />}

        </View>
    )
}

const CashDropBoards = ({ isCashDrop }) => {
    return (
        <Pressable style={[styles.topLeadersContainer, { opacity: !isCashDrop ? 0.4 : 1 }]}>
            <View style={styles.topLeadersSubContainer}>
                <View style={styles.imageAvatar}>
                    <Image
                        source={require('../../../assets/images/cash-locker.png')}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.leadersHeaderContainer}>
                    <Text style={styles.topLeadersHeader}>Cash drop</Text>
                    <Text style={styles.topLeadersHeaderi}>Lucky winners win the pools</Text>
                </View>
            </View>
            <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
        </Pressable>
    )
}
const PromotionsBoard = ({ isNewPromotion, onPress }) => {
    return (
        <Pressable style={[styles.topLeadersContainer, { opacity: !isNewPromotion ? 0.4 : 1 }]} onPress={onPress}>
            <View style={styles.topLeadersSubContainer}>
                <View style={styles.imageAvatari}>
                    <Image
                        source={require('../../../assets/images/promotion-gift.png')}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.leadersHeaderContainer}>
                    <Text style={styles.topLeadersHeader}>Promotions</Text>
                    <Text style={styles.topLeadersHeaderi}>Daily & weekly cashbag</Text>
                </View>
            </View>
            <Ionicons name='chevron-forward-sharp' size={20} color='#1C453B' />
        </Pressable>
    )
}

export default MarketingPromotionCards;

const styles = EStyleSheet.create({
    leadersContainer: {
        marginTop: '.7rem'
    },
    imageAvatar: {
        backgroundColor: '#FEECE7',
        borderRadius: 100,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: '2.3rem',
        height: '2.3rem',
    },
    imageAvatari: {
        backgroundColor: '#EBFAED',
        borderRadius: 100,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topLeadersContainer: {
        backgroundColor: '#FFF',
        borderColor: '#E5E5E5',
        borderWidth: 2,
        borderRadius: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '.5rem',
        paddingHorizontal: '.8rem',
        // opacity: 0.4,
        marginBottom: '.6rem'
    },
    topLeadersSubContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    topLeadersHeader: {
        fontSize: '1rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
    },
    leadersHeaderContainer: {
        marginLeft: '.6rem'
    },
    topLeadersHeaderi: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        width: '11rem',
        marginTop: '.2rem'
    },
})