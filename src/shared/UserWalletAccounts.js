import { useNavigation } from "@react-navigation/native";
import React from "react";
import SwiperFlatList from "react-native-swiper-flatlist";
import logToAnalytics from "../utils/analytics";
import { Pressable, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../utils/normalize";
import { formatCurrency, formatNumber } from "../utils/stringUtl";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";


const UserWalletAccounts = ({ user }) => {
    return (
        <View style={styles.walletsContainer}>
            <SwiperFlatList>
                <StakingWallet user={user} />
                <EarningsWallet user={user} />
                <UserBoosts user={user} />
            </SwiperFlatList>
        </View>
    )
}

const StakingWallet = ({ user }) => {
    const navigation = useNavigation();
    const viewWallet = async () => {
        logToAnalytics("add_fund_button_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }
    return (
        <Pressable style={styles.stakingWalletContainer} onPress={viewWallet}>
            <View style={styles.walletHeader}>
                <Ionicons name='wallet-outline' size={20} color='#E3ECF2' />
                <Text style={styles.walletHeaderText}>Staking Balance</Text>
            </View>
            <View style={styles.amountContainer}>
                <View style={styles.currencyContainer}>
                    <Text style={styles.balanceDigit}>NGN {formatCurrency(user.walletBalance ?? 0)}</Text>
                    <Ionicons name='chevron-forward-sharp' size={20} color='#E3ECF2' />
                </View>
                <View style={styles.addContainer} >
                    <Ionicons name='add' size={20} color='#072169' />
                    <Text style={styles.addText}>Add funds</Text>
                </View>
            </View>
        </Pressable>
    )
}
const EarningsWallet = ({ user }) => {
    const navigation = useNavigation();
    const viewWallet = async () => {
        logToAnalytics("earnings_button_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }
    return (
        <Pressable style={styles.earningsWalletContainer} onPress={viewWallet}>
            <View style={styles.walletHeader}>
                <Ionicons name='wallet-outline' size={20} color='#E3ECF2' />
                <Text style={styles.walletHeaderText}>Earnings</Text>
            </View>
            <View style={styles.amountContainer}>
                <View style={styles.currencyContainer}>
                    <Text style={styles.balanceDigit}>NGN {formatCurrency(user.withdrawableBalance ?? 0)}</Text>
                    <Ionicons name='chevron-forward-sharp' size={20} color='#E3ECF2' />
                </View>
                <View style={styles.addContainer} >
                    <Ionicons name='card-outline' size={20} color='#072169' />
                    <Text style={styles.addText}>Withdraw</Text>
                </View>
            </View>
        </Pressable>
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
        onPress={goToStore}>
            <View style={styles.boostHeader}>
                <Text style={styles.boostHeaderText}>{user.username} you have</Text>
                <View style={styles.boostSub}>
                     {/* {Platform.OS !== 'ios' && */}
                    <View style={styles.addContainer}>
                        <Ionicons name='card-outline' size={20} color='#072169' />
                        <Text style={styles.addText}>Buy Boost</Text>
                    </View>
                    {/* } */}
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
                    <Text style={styles.noBoostText}>No boost</Text>
                    {/* {Platform.OS !== 'ios' && */}
                        <View style={styles.boostSub}>
                            <Text style={styles.boostSubText}>Purchase boost</Text>
                            <Ionicons name='chevron-forward-sharp' size={20} color='#E3ECF2' />
                        </View>
                    {/* } */}
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
        <Pressable style={styles.boostContainer} onPress={Platform.OS !== 'ios' ? goToStore : doNothing}>
            <View style={styles.boostIconContainer}>
                <Image
                    source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
            </View>
            <Text style={styles.boostAmount}> x{formatNumber(boost.count)} </Text>
            <Text style={styles.boostAmount}>{boost.name}</Text>
        </Pressable>
    )
}

export default UserWalletAccounts;

const styles = EStyleSheet.create({
    walletsContainer: {
        marginTop: '2rem'
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
        backgroundColor: '#701F88',
        flexDirection: 'column',
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(20),
        width: normalize(295),
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
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
    walletHeaderText: {
        fontSize: '1rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
        marginLeft: '.5rem'
    },
    boostHeaderText: {
        fontSize: '1rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem'
    },
    noContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem'
    },
    itemsContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem'
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#EFF2F6',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: '.3rem',
        paddingVertical: '.2rem',
        marginRight:'.5rem'
    },
    boostIconContainer: {
        backgroundColor: '#EFF2F6',
        borderRadius: 50,
        padding: '.15rem'
    },
    boostIcon: {
        width: '.6rem',
        height: '.6rem'
    },
    boostAmount: {
        fontSize: '.6rem',
        color: '#E3ECF2',
        marginLeft: '.1rem',
        fontFamily: 'sansation-regular',
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
        backgroundColor: '#E3ECF2',
        borderRadius: 20,
        paddingHorizontal: '.6rem',
        paddingVertical: '.15rem'
    },
    addText: {
        fontSize: '.7rem',
        color: '#072169',
        marginLeft: '.3rem',
        fontFamily: 'sansation-bold',
    },
    noBoostText: {
        fontSize: '.7rem',
        color: '#E3ECF2',
        marginLeft: '.3rem',
        fontFamily: 'sansation-bold',
    },
})