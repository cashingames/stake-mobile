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
            <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
        </Pressable>
    )
}
const ChallengeLeaderboard = () => {
    return (
        <Pressable style={styles.challengeContainer}>
            <Text style={styles.topLeadersHeader}>Challenges</Text>
            <Image
                source={require('../../../assets/images/challenge-coin.png')}
                style={styles.avatar}
            />
            <Text style={styles.topLeadersText}>Daily & weekly challenges</Text>
            <View style={styles.challengeButton}>
                <Text style={styles.playButtonText}>
                    Coming Soon!!
                </Text>
            </View>
        </Pressable>
    )
}

const BoostsCard = () => {
    const navigation = useNavigation();
    const goToStore = async () => {
        logToAnalytics("boost_card_clicked")
        navigation.navigate('GameStore')
    }
    if (Platform.OS === 'ios') return null
    return (
        <Pressable style={styles.boostsContainer} onPress={goToStore}>
            <Text style={styles.topLeadersHeader}>Boost</Text>
            <Image
                source={require('../../../assets/images/boost-chest.png')}
                style={styles.avatar}
            />
            <Text style={styles.topLeadersText}>Bonuses, Time freeze & Skip</Text>
            <View style={styles.boostButton}>
                <Text style={styles.playButtonText}>
                    Learn More
                </Text>
            </View>
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
    challengeContainer: {
        backgroundColor: '#EBFAED',
        borderColor: '#71DC7F',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(258),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        // marginRight: '1rem',
        opacity: 0.6,
        paddingHorizontal: '1rem'
    },
    boostsContainer: {
        backgroundColor: '#F6F4FF',
        borderColor: '#917BFE',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(258),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        paddingHorizontal: '1rem',
        marginRight: '1rem',

    },
    topLeadersHeader: {
        fontSize: '.95rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
    },
    leadersHeaderContainer: {
        marginLeft: '.6rem'
    },
    topLeadersHeaderi: {
        fontSize: '.85rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
        width: '11rem',
        marginTop: '.2rem'
    },
    topLeadersText: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
        textAlign: 'center'
    },
    playButton: {
        backgroundColor: '#FA5F4A',
        paddingVertical: '.5rem',
        paddingHorizontal: '.7rem',
        borderRadius: 20
    },
    challengeButton: {
        backgroundColor: '#71DC7F',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    boostButton: {
        backgroundColor: '#917BFE',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    playButtonText: {
        fontSize: '.7rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
})