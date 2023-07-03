import React, { useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import logToAnalytics from "../../utils/analytics";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";


const PromotionsScreen = () => {
    const [isNewPromotion, setIsNewPromotion] = useState(true);
    const user = useSelector(state => state.auth.user);


    const promotions = [
        {
            "id": 1,
            "bannerImage": require('../../../assets/images/bonus-banner1.png'),
            "innerBanner": require('../../../assets/images/bonus-banner2.png'),
            "name": 'Welcome Bonus',
            "description" : 'Get an instant 100% Cashback bonus on your first deposit to a limit of N10,000! You can use your bonus amount to stake and earn cash. Bonus expires in 7 days. Terms and conditions apply.'
        },
        {
            "id": 2,
            "bannerImage": require('../../../assets/images/cashback-banner1.png'),
            "innerBanner": require('../../../assets/images/cashback-banner2.png'),
            "name": 'Saturday 10% Cashback',
            "description" : "Get 10% cashback on your losses by the end of every week! We've got you covered. The higher your stakes, the bigger your bonus! Bonus expires in 3 Days. Terms and conditions apply."
        },
    ]

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={isNewPromotion ? styles.container : {}} contentContainerStyle={!isNewPromotion ? styles.noContainer : {}}>
                {!isNewPromotion ?
                    <>
                        <Image
                            source={require('../../../assets/images/gift-dynamic.png')}
                            style={styles.avatar}
                        />
                        <Text style={styles.noPromotionsText}>No promotions yet, check back later</Text>
                    </>
                    :
                    <View>
                        {
                            promotions.map((promotion, i) => <PromotionBanner key={i} promotion={promotion} user={user}
                            />)
                        }
                    </View>
                }
            </ScrollView>
        </ImageBackground>
    )
}

const PromotionBanner = ({ promotion, user }) => {
    const navigation = useNavigation();

    const viewPromotion = () => {
        logToAnalytics("promotions_button_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'promotion_title': promotion.name,
        })
        navigation.navigate('Promotion', {
            promotion_title: promotion.name,
            inner_banner: promotion.innerBanner,
            promotion_description: promotion.description,
        })
    }
    return (
        <Pressable style={styles.bannerContainer} onPress={viewPromotion}>
            <Image
                source={promotion.bannerImage}
                style={styles.triviaAvatar}
            />
        </Pressable>
    )
}

export default PromotionsScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(14),
        paddingTop: normalize(22)
    },
    noContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(14),

    },
    avatar: {
        width: '6rem',
        height: '6rem',
    },
    noPromotionsText: {
        fontSize: '1.4rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
        textAlign: 'center',
        lineHeight: '1.8rem'
    },
    bannerContainer: {
        alignItems: 'center',
        marginBottom: '1.1rem'
    },
    triviaAvatar: {
        borderRadius: 13,
        width: normalize(320),
        height: normalize(245),

    }
})