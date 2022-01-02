import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Alert } from 'react-native';
import normalize from "../../utils/normalize";
import { formatNumber } from '../../utils/stringUtl';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import AppButton from "../../shared/AppButton";
import { unwrapResult } from '@reduxjs/toolkit';
import { backendUrl } from '../../utils/BaseUrl';
import { startGame } from "./GameSlice";



export default function GameInstructionsScreen({ navigation, route }) {
    const gameMode = useSelector(state => state.game.gameMode);
    const refRBSheet = useRef();

    return (
        <ScrollView style={styles.container}>
            {gameMode.name === "EXHIBITION" && <ExhibitionInstructions />}
            {gameMode.name === "CHALLENGE" && <ChallengeInstructions />}
            <AppButton onPress={() => refRBSheet.current.open()} text='Proceed' />
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
                <AvailableBoosts onClose={() => refRBSheet.current.close()} />
            </RBSheet>
        </ScrollView>
    );
};
const ExhibitionInstructions = () => {
    return (
        <>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0031'}.</Text>
                <Text style={styles.instructionText}>There are 10 questions per session.
                    You are required to answer these 10 questions in 60 seconds</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0032'}.</Text>
                <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
                    progress to the next question.</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0033'}.</Text>
                <Text style={styles.instructionText}>At the end of the session, you would see your total score</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0034'}.</Text>
                <Text style={styles.instructionText}>Click “Play again” to start another session in winning
                    more points to climb the leader board.</Text>
            </View>
        </>
    )
};

const ChallengeInstructions = () => {
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

const AvailableBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>
            <View style={styles.boostAmount}>
                <Image
                    source={{ uri: `${backendUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.boostDescription}>{boost.description}</Text>
            </View>
        </View>
    )
}


const AvailableBoosts = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameModeId = useSelector(state => state.game.gameMode.id);
    const [loading, setLoading] = useState(false);

    const onStartGame = () => {
        setLoading(true);
        dispatch(startGame({
            category: gameCategoryId,
            type: gameTypeId,
            mode: gameModeId
        }))
            .then(unwrapResult)
            .then(result => {
                console.log(result)
                setLoading(false);
                onClose();
                navigation.navigate("GameInProgress")
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to start game')
                setLoading(false);
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError)
            });
    }



    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <AvailableBoost boost={boost} key={i} />
                )}
            </View>
            <GoToStore onPress={visitStore} />
            <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />
        </View>
    )
}

const GoToStore = ({ onPress }) => {
    const navigation = useNavigation();


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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(20)
    },
    instruction: {
        flexDirection: 'row',
        marginBottom: normalize(20)
    },
    instructionHeader: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: normalize(18),
        textAlign: 'justify',
        width: normalize(250),
        marginBottom: normalize(35)
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
        lineHeight: normalize(18),
        textAlign: 'justify',
        width: normalize(250)
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
    boostIcon: {
        width: normalize(30),
        height: normalize(30)
    }
});
