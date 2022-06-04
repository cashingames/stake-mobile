import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, Pressable, ImageBackground, Modal } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import Animated from 'react-native-reanimated';
import { isTrue, formatCurrency, formatNumber } from '../utils/stringUtl';
import normalize, {
    responsiveScreenWidth
} from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import { calculateTimeRemaining, randomEnteringAnimation } from '../utils/utils';
import Constants from 'expo-constants';


const LiveTriviaCard = ({ liveTrivia }) => {
    const navigation = useNavigation()
    const [instructionModalVisible, setInstructionModalVisible] = useState(false);

    const goToTriviaLeaderboard = () => {
        navigation.navigate('Game')
    }

    const goToPlayTrivia = () => {
        navigation.navigate('Game')
    }

    return (
        <>

            <Animated.View entering={randomEnteringAnimation().duration(2000)} style={styles.triviaContainer}>

                <TriviaInstructionsModal
                    instructionModalVisible={instructionModalVisible}
                    setInstructionModalVisible={setInstructionModalVisible}
                />
                <ImageBackground
                    source={require('../../assets/images/live-trivia-card-background-blue.png')}
                    style={styles.triviaBackground}
                    imageStyle={{ borderRadius: 20 }}
                    resizeMode='cover'>
                    <View style={styles.triviaCardTop}>
                        <Text style={styles.triviaName}>{liveTrivia.name}</Text>
                        <View style={styles.triviaTopLeft}>
                            <Image
                                source={require('../../assets/images/yellow-line-top.png')}
                                style={styles.triviaYellowLine}
                            />
                            <Ionicons name="information-circle-outline" size={24} color="#FFFF" />
                        </View>

                    </View>
                    <Text style={styles.triviaAmount}>&#8358;{formatCurrency(liveTrivia.grand_price)}</Text>
                    <Text style={styles.triviaAdText}>up for grab!</Text>
                    {/* <Text style={styles.triviaTimeText}>Grand price: &#8358;{formatCurrency(upcomingTrivia.grand_price)}</Text> */}
                    {/* <Text style={styles.triviaDate}>{upcomingTrivia.start_time}</Text> */}
                    {/* <Text style={styles.triviaDate}>Points eligibility: {upcomingTrivia.point_eligibility}</Text> */}
                    <View style={styles.triviaBoardBottom}>

                        <View>
                            <View style={styles.triviaStatus}>
                                <Text style={styles.triviaStatusText}>Status: </Text>
                                {
                                    liveTrivia.status === "ONGOING" ?
                                        <Text style={styles.triviaStatusResp}>Ongoing</Text> : <Text style={styles.triviaStatusResp}>Closed</Text>
                                }
                            </View>
                            <Image
                                source={require('../../assets/images/yellow-line-bottom.png')}
                            />
                        </View>
                        {!liveTrivia.has_played ?
                            <>
                                {
                                    liveTrivia.status === "ONGOING" ?
                                        <Pressable style={styles.triviaButton} onPress={() => setInstructionModalVisible(true)}>
                                            <Text style={styles.triviaButtonText}>Join Now</Text>
                                            <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
                                        </Pressable>
                                        :
                                        <Pressable style={styles.triviaButton}>
                                            <Text style={styles.triviaButtonText}>Leaderboard</Text>
                                            <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
                                        </Pressable>
                                }
                            </>
                            :
                            <Pressable style={styles.triviaButton}>
                                <Text style={styles.triviaButtonText}>Leaderboard</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
                            </Pressable>
                        }


                    </View>
                </ImageBackground>
            </Animated.View>
        </>
    )
}


const TriviaInstructions = () => {
    return (
        <View style={styles.instructionContainer}>
            <Text style={styles.instructionHeader}>Game Instructions</Text>
            <View>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0031'}.</Text>
                    <Text style={styles.instructionText}>This trivia consists of  questions</Text>
                </View>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0032'}.</Text>
                    <Text style={styles.instructionText}>You have limited time to answer these questions. Answer questions as correctly
                        and as rapidly as you can to stay at the top of the leaderboard.</Text>
                </View>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0033'}.</Text>
                    <Text style={styles.instructionText}>Use boosts to increase your chances of winning the grand prize.</Text>
                </View>
            </View>
        </View>
    )
}

const TriviaInstructionsModal = ({ instructionModalVisible, setInstructionModalVisible }) => {
    const [boostModalVisible, setBoostModalVisible] = useState(false);

    const proceedToBoostModal = () => {
        setBoostModalVisible(true);
        setInstructionModalVisible(false)
    }

    return (
        <>
            <TriviaBoostModal
                boostModalVisible={boostModalVisible}
                setBoostModalVisible={setBoostModalVisible}
                instructionModalVisible={instructionModalVisible}
                setInstructionModalVisible={setInstructionModalVisible}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={instructionModalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setInstructionModalVisible(!instructionModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TriviaInstructions />
                        <Pressable
                            style={styles.buttonClose}
                            onPress={proceedToBoostModal}
                        >
                            <Text style={styles.proceedTextStyle}>Proceed</Text>
                        </Pressable>
                        <Text
                            style={styles.textStyle}
                            onPress={() => setInstructionModalVisible(!instructionModalVisible)}>Close</Text>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const TriviaBoosts = () => {
    const boosts = useSelector(state => state.auth.user.boosts);
    return (
        <View style={styles.instructionContainer}>
            <Text style={styles.instructionHeader}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts ?
                    <>
                        {boosts.map((boost, i) => <TriviaBoost boost={boost} key={i} />
                        )}
                    </>
                    :
                    <Text style={styles.title}>No boost available</Text>
                }

            </View>
        </View>
    )
}

const TriviaBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>

            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.boostDescription}>{boost.description}</Text>
            </View>
            <View style={styles.boostAmount}>
                <Image
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>

        </View>
    )
}

const TriviaBoostModal = ({ boostModalVisible, setBoostModalVisible, setInstructionModalVisible }) => {
    const navigation = useNavigation();
    const closeBoostModal = () => {
        setBoostModalVisible(false);
        setInstructionModalVisible(false)
    }

    const visitStore = () => {
        setBoostModalVisible(false);
        navigation.navigate('GameStore')
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={boostModalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setBoostModalVisible(!boostModalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TriviaBoosts />
                    <GoToStore onPress={visitStore} />
                    <Pressable
                        style={styles.buttonClose}
                    >
                        <Text style={styles.proceedTextStyle}>Start Game</Text>
                    </Pressable>
                    <Text
                        style={styles.textStyle}
                        onPress={closeBoostModal}>Close
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

const GoToStore = ({ onPress }) => {
    return (
        <View style={styles.moreBoost}>

            <Pressable onPress={onPress}>
                <Text style={styles.needBoost}>Need more boosts?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>

        </View>
    )
}


const styles = EStyleSheet.create({
    triviaContainer: {
        marginTop: responsiveScreenWidth(5),
    },
    triviaBackground: {
        flex: 1,
        justifyContent: "center",
        paddingVertical: '.7rem',
        paddingHorizontal: '.8rem',
        borderRadius: 20,
    },
    triviaCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    triviaYellowLine: {
        marginRight: normalize(6)
    },
    triviaTopLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    triviaName: {
        fontSize: '0.85rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
    },
    triviaAmount: {
        fontSize: '1.8rem',
        color: '#FFFF',
        lineHeight: '2.1rem',
        fontFamily: 'graphik-medium',
    },
    triviaAdText: {
        fontSize: '.85rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaBoardBottom: {
        marginTop: responsiveScreenWidth(10),
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: 'space-between',
    },
    triviaStatus: {
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: normalize(5),
    },
    triviaStatusText: {
        fontSize: '.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaStatusResp: {
        fontSize: '.65rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        opacity: 0.8
    },
    triviaButton: {
        backgroundColor: '#FFD064',
        borderRadius: 12,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderColor: '#C39938',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(5.5),
        alignItems: 'center',
        flexDirection: 'row'
    },
    triviaButtonText: {
        fontSize: '.7rem',
        color: '#4F4949',
        fontFamily: 'graphik-medium',
    },
    triviaTimeCountdown: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: "0.5rem",
    },
    timeIcon: {
        marginRight: 7
    },
    triviaTimeCountdownText: {
        fontSize: '0.8rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        lineHeight: '0.8rem'
    },
    centeredView: {
        flex: 1,
        marginVertical: responsiveScreenWidth(17),
        marginHorizontal: responsiveScreenWidth(5),

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: normalize(35),
        paddingVertical: normalize(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#518EF8",
        paddingVertical: normalize(10),
        borderRadius: 10,
        marginTop: normalize(20)
    },
    proceedTextStyle: {
        color: "#FFFF",
        fontSize: '1rem',
        fontFamily: 'graphik-regular',
        textAlign: "center",
    },
    textStyle: {
        color: "#FF0202",
        fontSize: '1rem',
        fontFamily: 'graphik-regular',
        textAlign: "center",
        marginTop: normalize(15)
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    instruction: {
        flexDirection: 'row',
        marginBottom: normalize(12)
    },
    instructionHeader: {
        fontSize: '1.1rem',
        fontFamily: 'graphik-bold',
        color: '#1D1D1B',
        lineHeight: '1.4rem',
        marginBottom: normalize(20)
    },
    unicode: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
        color: '#000000',
        marginRight: normalize(10)
    },
    instructionText: {
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
        color: '#1D1D1B',
        lineHeight: '1.2rem',
        textAlign: 'justify',
    },
    instructionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: normalize(90),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        borderRadius: 12,
        backgroundColor: '#EF2F55'
    },

    amount: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#FF932F'
    },
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    boosts: {
        // alignItems: ''

    },
    boostContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        marginBottom: normalize(17)
    },
    boostAmount: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boostDetails: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: normalize(15),
    },
    boostName: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: '1.2rem',
    },
    boostDescription: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: '1.2rem',
        width: responsiveScreenWidth(60),
    },
    storeLink: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    needBoost: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    moreBoost: {
        alignItems: 'center',
    },
    startContainer: {
        marginTop: normalize(50),
    },
    boostIcon: {
        width: normalize(35),
        height: normalize(35)
    }
})

export default LiveTriviaCard
