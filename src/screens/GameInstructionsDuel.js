import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeaderBack from '../components/HeaderBack';
import RBSheet from "react-native-raw-bottom-sheet";

export default function GameInstructionsDuel({ navigation }) {

    const refRBSheet = useRef();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('GameMode')} />
                    <Text style={styles.headerTextStyle}>Game Instructions</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.content}>
                        <Instructions />
                        <ProceedButton onPress={() => refRBSheet.current.open()} text='Proceed' />
                    </View>
                </View>
                {/* <BoostDialog ref={refRBSheet} /> */}
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={480}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)"
                        },
                        draggableIcon: {
                            backgroundColor: "#000",
                        },
                        container: {
                            borderTopStartRadius: 25,
                            borderTopEndRadius: 25,
                        }
                    }}
                >
                    <AvailableBoosts />
                </RBSheet>
            </ScrollView>
        </SafeAreaView>
    );
};
const Instructions = () => {
    return (
        <>
            <Text style={styles.instructionHeader}>Ready to start winning? Let’s get started
                by reading the following instructions carefully.
            </Text>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0031'}.</Text>
                <Text style={styles.instructionText}>There are 10 questions per session.
                    You are required to answer these 10 questions in 60 seconds</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0032'}.</Text>
                <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
                    progress to the next question. You can also see your competitor’s progress
                    opposite yours on the upper right corner of your screen.
                </Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0033'}.</Text>
                <Text style={styles.instructionText}>At the end of the session, you would see
                    your total score against that of your competitor.
                </Text>
            </View>
        </>
    )
};
const ProceedButton = ({ text, onPress }) => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable onPress={onPress}
                style={styles.button}

            >
                <Text style={styles.playButton}>{text}</Text>
            </Pressable>
        </View>
    )
};

const AvailableBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>
            <View style={styles.boostAmount}>
                <Image
                    // source={require('../../assets/images/bomb.png')}
                    source={boost.boostIcon}
                />
                <Text style={styles.amount}>{boost.amount}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.boostName}</Text>
                <Text style={styles.boostDescription}>{boost.boostDescription}</Text>
            </View>
        </View>
    )
}


const AvailableBoosts = () => {
    const navigation = useNavigation();

    const boosts = [
        {
            id: 1,
            boostIcon: require('../../assets/images/time_freeze.png'),
            amount: "x5",
            boostName: 'Time Freeze',
            boostDescription: 'Time freeze for 15 seconds'
        },
        {
            id: 2,
            boostIcon: require('../../assets/images/skip.png'),
            amount: "x3",
            boostName: 'Skip',
            boostDescription: 'Answer a different question'
        },
        {
            id: 3,
            boostIcon: require('../../assets/images/bomb.png'),
            amount: "x3",
            boostName: 'Bomb',
            boostDescription: 'Removes two wrong answers'
        }
    ]

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost) => <AvailableBoost boost={boost} />)}
            </View>
            <GoToStore />
            <StartGameButton text='Proceed' onPress={() => navigation.navigate('DuelSelectPlayer')} />
        </View>
    )
}

const GoToStore = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.moreBoost}>

            <Pressable onPress={() => navigation.navigate('Dashboard')}>
                <Text style={styles.needBoost}>Need more boosts?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>

        </View>
    )
}

const StartGameButton = ({ text, onPress }) => {
    return (
        <View style={styles.startContainer}>
            <Pressable onPress={onPress}
                style={styles.button}

            >
                <Text style={styles.playButton}>{text}</Text>
            </Pressable>
        </View>
    )
};

const BoostDialog = ({ ref }) => {

    return (
        <RBSheet
            ref={ref}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
                wrapper: {
                    backgroundColor: "transparent"
                },
                draggableIcon: {
                    backgroundColor: "#000"
                }
            }}
        >
            <AvailableBoosts />
        </RBSheet>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        paddingHorizontal: normalize(18),
        marginTop: normalize(20)
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        backgroundColor: '#FFFF',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    instruction: {
        flexDirection: 'row',
        // alignItems: 'center'
        marginBottom: normalize(20)
    },
    unicode: {
        fontSize: normalize(28),
        fontFamily: 'graphik-bold',
        color: '#4F4F4F',
        marginRight: normalize(10)
    },
    instructionText: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: normalize(20),
        textAlign: 'justify',
        width: normalize(250)
    },
    instructionHeader: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: normalize(20),
        textAlign: 'justify',
        width: normalize(250),
        marginBottom: normalize(35)
    },
    buttonContainer: {
        marginTop: normalize(50),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        borderRadius: 12,
        backgroundColor: '#EF2F55'
    },
    playButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },
    amount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#FF932F'
    },
    title: {
        fontSize: normalize(13),
        fontFamily: 'graphik-bold',
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
    },
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boostDetails: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: normalize(15),
        justifyContent: 'center'
    },
    boostName: {
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: 21,
    },
    boostDescription: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: 21,
        width: normalize(170),
        // textAlign:'right'

    },
    storeLink: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    needBoost: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    moreBoost: {
        alignItems: 'center',
    },
    startContainer: {
        marginTop: normalize(50),
    },
});
