import React from "react";
import { useNavigation } from "@react-navigation/native";
import logToAnalytics from "../../utils/analytics";
import { Pressable, View, Text, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../../utils/normalize";
import { formatNumber } from "../../utils/stringUtl";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";



const UserAvailabeBoosts = () => {

    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const boosts = user.boosts;

    const goToStore = async () => {
        logToAnalytics("earnings_button_clicked", {
            'id': user.username,
        })
        navigation.navigate('GameStore')
    }

    const doNothing = () => {

    }
    return (
        <View style={styles.walletsContainer}>
            <Pressable style={styles.boostsContainer}
                onPress={Platform.OS !== 'ios' ? goToStore : doNothing}
                // onPress={goToStore}

            >
                <View style={styles.boostHeader}>
                    <Text style={styles.boostHeaderText}>Available boosts</Text>
                    <View style={styles.boostSub}>
                        {Platform.OS !== 'ios' &&
                            <View style={styles.addContainer}>
                                <Text style={styles.addText}>Get boost</Text>
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
                                    source={require('../../../assets/images/timefreeze-boost.png')}
                                    style={styles.boostIcon}
                                />
                            </View>
                            <Text style={styles.boostAmount}>x0</Text>
                        </View>
                        <View style={styles.boostContainer}>
                            <View style={styles.boostIconContainer}>
                                <Image
                                    source={require('../../../assets/images/skip-boost.png')}
                                    style={styles.boostIcon}
                                />
                            </View>
                            <Text style={styles.boostAmount}>x0</Text>
                        </View>
                    </View>
                }
            </Pressable>
        </View>
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

export default UserAvailabeBoosts;

const styles = EStyleSheet.create({
    walletsContainer: {
        marginTop: '1.2rem'
    },
    boostsContainer: {
        backgroundColor: '#FAF0E8',
        flexDirection: 'column',
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        paddingTop: normalize(12),
        borderColor: '#E5E5E5',
        borderWidth: 1
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
    boostHeaderText: {
        fontSize: '.8rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    noContainer: {
        flexDirection: 'row',
        marginTop: '.3rem'
    },
    itemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.2rem'
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '2rem'
    },
    boostIcon: {
        width: '3.5rem',
        height: '3.5rem'
    },
    boostAmount: {
        fontSize: '.9rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#121212',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        position: 'absolute',
        left: 35,
        top: 10
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingHorizontal: '.4rem',
        paddingVertical: '.3rem'
    },
    addText: {
        fontSize: '.75rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    },
})