import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import { formatCurrency } from "../../utils/stringUtl";
import AppButton from "../../shared/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { setCashMode, setGameMode, setGameType } from "../Games/GameSlice";
import logToAnalytics from "../../utils/analytics";


const DropWinnerScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const params = route.params;

    const goBack = () => {
        navigation.navigate('CashDrop')
    }

    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);
    const user = useSelector(state => state.auth.user);

    const stakeNow = () => {
        console.log('now')
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        dispatch(setCashMode(true));
        logToAnalytics("drop_stake_now_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        navigation.navigate('SelectGameCategory')
    }
    return (
        <View style={styles.container} >
            <ScrollView>

                <View style={styles.headerContainer}>
                    <Ionicons name='chevron-back-sharp' size={29} color='#1C453B' onPress={goBack} />
                    <Text style={styles.headerText}>{params.winner_rank}</Text>
                    <View></View>
                </View>
                <View style={styles.winnerDetailsContainer}>
                    <Image
                        source={params.winner_avatar}
                        style={styles.winnerAvatar}
                    />
                    <Image
                        source={params.winner_badge}
                        style={styles.badgeAvatar}
                    />
                    <View style={styles.winnerNames}>
                        <Text style={styles.winnerFullname}>{params.winner_firstname} {params.winner_lastname}</Text>
                    </View>
                </View>
                <View style={[styles.dropContainer, { backgroundColor: params.drop_background }]}>
                    <View style={styles.badgeContainer}>
                        <Image
                            source={params.winner_badge}
                            style={styles.badgeIcon}
                        />
                    </View>
                    <View style={styles.dropDetails}>
                        <Text style={styles.dropName}>{params.won_drop}</Text>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountDigit}>{formatCurrency(params.drop_amount)}</Text>
                            <Text style={styles.amaountCurrency}>NGN</Text>
                        </View>
                    </View>
                    <View style={styles.stakeContainer}>
                        <Text style={styles.stakeText}>Winner</Text>
                    </View>
                </View>
            </ScrollView>
            <AppButton text='Stake Now' onPress={stakeNow} style={styles.stakeButton} isIcon={false} />
        </View>
    )
}
export default DropWinnerScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(22),
        justifyContent:'space-between'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        alignItems: 'center',
        paddingTop: normalize(25),
    },
    headerText: {
        fontSize: 23,
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    winnerDetailsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    winnerAvatar: {
        width: '7rem',
        height: '7rem',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 100
    },
    badgeAvatar: {
        width: '4rem',
        height: '4rem',
        position: 'absolute',
        top: '4.3rem'
    },
    winnerNames: {
        backgroundColor: '#FA5F4A',
        marginTop: '1rem',
        borderRadius: 30,
        paddingVertical: '.3rem',
        paddingHorizontal: '1rem',
        alignItems: 'center'
    },
    winnerFullname: {
        fontSize: '.95rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    },
    dropContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '1rem',
        paddingTop: '.7rem',
        paddingBottom: '1.1rem',
        borderRadius: 13,
        marginTop: '1.1rem',
        borderWidth: 1,
        borderColor: '#E5E5E5'
    },
    badgeContainer: {
        backgroundColor: '#FFF',
        borderRadius: 100,
        padding: '.2rem',
        width: '3.3rem',
        height: '3.3rem'
    },
    badgeIcon: {
        width: '3.7rem',
        height: '3.7rem',
        position: 'absolute',
        top: '.3rem'
    },
    dropDetails: {
        flexDirection: 'column'
    },
    dropName: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.2rem'
    },
    amountDigit: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'sansation-bold',
        marginRight: '.2rem'
    },
    amountCurrency: {
        fontSize: '.7rem',
        color: '#1C453B',
        fontFamily: 'sansation-regular',
    },
    stakeContainer: {
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingVertical: '.2rem',
        paddingHorizontal: '.4rem',
        alignItems: 'center'
    },
    stakeText: {
        fontSize: '.55rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    },
    stakeButton: {
        // backgroundColor: '#E15220',
        marginVertical: 0,
        marginBottom: 20,
        paddingVertical: normalize(19),
    },
})