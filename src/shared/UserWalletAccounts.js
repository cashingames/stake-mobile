import { useNavigation } from "@react-navigation/native";
import React from "react";
import SwiperFlatList from "react-native-swiper-flatlist";
import logToAnalytics from "../utils/analytics";
import { Pressable, View, Text, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../utils/normalize";
import { formatCurrency, formatNumber } from "../utils/stringUtl";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";


const UserWalletAccounts = ({ user }) => {
    return (
        <View style={styles.walletsContainer}>
            <UserBoosts user={user} />
        </View>
    )
}

const UserBoosts = ({ user }) => {
    const boosts = useSelector(state => state.auth.user.boosts);

    const navigation = useNavigation();
    const goToStore = async () => {
        logToAnalytics("earnings_button_clicked", {
            'id': user.username,
        })
        navigation.navigate('GameStore')
    }

    const doNothing = () => {

    }

    return (
        <Pressable style={styles.boostsContainer}
            // onPress={Platform.OS !== 'ios' ? goToStore : doNothing}
        // onPress={goToStore}
        >
            <View style={styles.boostHeader}>
                <Text style={styles.boostHeaderText}>Available boosts</Text>
                <View style={styles.boostSub}>
                    {Platform.OS !== 'ios' &&
                        <View style={styles.addContainer}>
                            <Text style={styles.addText}>Get Boost</Text>
                            <Ionicons name='chevron-forward-sharp' size={15} color='#F9FBFF' />
                        </View>
                    }
                </View>
            </View>
            {boosts?.length > 0 ?
                <View style={styles.itemsContainer}>

                    {
                        boosts.map((boost, index) =>
                            <UserBoost boost={boost} key={index} />
                        )
                    }


                </View>
                :
                <View style={styles.noContainer}>
                    <View style={styles.boostContainer}>
                        <View style={styles.boostIconContainer}>
                            <Image
                                source={require('../../assets/images/timefreeze-boost.png')}
                                style={styles.boostIcon}
                            />
                        </View>
                        <Text style={styles.boostAmount}>x0</Text>
                    </View>
                    <View style={styles.boostContainer}>
                        <View style={styles.boostIconContainer}>
                            <Image
                                source={require('../../assets/images/skip-boost.png')}
                                style={styles.boostIcon}
                            />
                        </View>
                        <Text style={styles.boostAmount}>x0</Text>
                    </View>
                </View>
            }
        </Pressable>
    )
}

const UserBoost = ({ boost }) => {
    const navigation = useNavigation();
    const goToStore = async () => {
        logToAnalytics("boost_button_clicked", {
            'id': boost.name
        })
        navigation.navigate('GameStore')
    }
    const doNothing = () => {

    }
    return (
        <View style={styles.boostContainer}>
                <Image
                    source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
            <Text style={styles.boostAmount}>x{formatNumber(boost.count)}</Text>
            {/* <Text style={styles.boostAmount}>{boost.name}</Text> */}
        </View>
    )
}

export default UserWalletAccounts;

const styles = EStyleSheet.create({
    walletsContainer: {
        marginTop: '1.2rem'
    },
    stakingWalletContainer: {
        backgroundColor: '#6A5BE1',
        flexDirection: 'column',
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(20),
        width: normalize(295),
        marginRight: '1rem'
    },
    earningsWalletContainer: {
        backgroundColor: '#072169',
        flexDirection: 'column',
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(20),
        width: normalize(295),
        marginRight: '1rem'
    },
    boostsContainer: {
        backgroundColor: '#FFF',
        flexDirection: 'column',
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        paddingTop: normalize(20),
        borderColor: '#E5E5E5',
        borderWidth: 1
        // width: normalize(295),
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    boostHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boostSub: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boostSubText: {
        fontSize: '.7rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
    },
    walletHeaderText: {
        fontSize: '1.1rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
        marginLeft: '.5rem'
    },
    boostHeaderText: {
        fontSize: '.8rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem'
    },
    noContainer: {
        flexDirection: 'row',
        marginTop: '.3rem'
    },
    itemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.3rem'
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1rem'
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem'
    },
    boostAmount: {
        fontSize: '.85rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#121212',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        position:'absolute',
        left: 35,
        top: 10
    },
    currencyContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    balanceDigit: {
        fontSize: '1rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-regular',
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingHorizontal: '.5rem',
        paddingVertical: '.2rem'
    },
    avatar: {
        width: '1rem',
        // height:'1rem'
    },
    addText: {
        fontSize: '.7rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    },
    noBoostText: {
        fontSize: '.7rem',
        color: '#072169',
        marginLeft: '.3rem',
        fontFamily: 'sansation-bold',
    },
})