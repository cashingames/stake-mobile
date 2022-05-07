import React, { useRef, useState } from "react";
import { Text, View, Image, ScrollView, Pressable, Alert } from 'react-native';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { formatNumber } from '../../utils/stringUtl';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import AppButton from "../../shared/AppButton";
import { unwrapResult } from '@reduxjs/toolkit';
import { backendUrl } from '../../utils/BaseUrl';
import { startGame, setGameSessionToken, setIsPlayingTrivia, setQuestionsCount, setGameDuration } from "./GameSlice";
import EStyleSheet from "react-native-extended-stylesheet";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";



export default function TriviaInstructionsScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const params = route.params;
    const refRBSheet = useRef();
    const onProceed = () => {
        refRBSheet.current.open()
    }

    return (
        <ScrollView style={styles.container}>
            <TriviaInstructions />
            <AppButton onPress={onProceed} text='Proceed' />
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
                <AvailableBoosts onClose={() => refRBSheet.current.close()} params={params} />
            </RBSheet>
        </ScrollView>
    );
};
const TriviaInstructions = () => {
    return (
        <>
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


const AvailableBoosts = ({ onClose, params }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);
    const [loading, setLoading] = useState(false);

    const onStartGame = () => {
        setLoading(true);
        dispatch(setIsPlayingTrivia(true))
        dispatch(setQuestionsCount(params.questionCount));
        dispatch(setGameDuration(params.gameDuration));
        dispatch(startGame({
            category: params.category,
            type: params.type,
            mode: params.mode,
            trivia: params.trivia
        }))
            .then(unwrapResult)
            .then(result => {
                console.log(result);
                setLoading(false);
                onClose();
                navigation.navigate("GameInProgress",
                    {
                        triviaId: params.trivia,
                    }
                )
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

    const endResult = () => {
        onClose();
        navigation.navigate('TriviaEndResult')
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
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.4rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80),
        marginBottom: normalize(35)
    },
    unicode: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-bold',
        color: '#4F4F4F',
        marginRight: normalize(10)
    },
    instructionText: {
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.4rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80)
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
});
