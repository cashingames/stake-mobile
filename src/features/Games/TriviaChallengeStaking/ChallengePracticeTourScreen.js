import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Image, ImageBackground, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import { formatNumber, isTrue } from "../../../utils/stringUtl";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import Constants from 'expo-constants';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../../shared/AppButton";
import { useNavigation } from "@react-navigation/native";
import {
    CopilotProvider,
    CopilotStep,
    useCopilot,
    walkthroughable,
} from "react-native-copilot";



const CopilotText = walkthroughable(Text);


const ChallengePracticeTourScreen = () => {



    return (
        // <ImageBackground source={require('../../../../assets/images/game-play-background.png')} style={styles.image} resizeMode="contain">
        <View style={styles.image}>
            <CopilotProvider>
                <Practice />
            </CopilotProvider>
        </View>
        // </ImageBackground >
    )
}

const Practice = () => {
    const navigation = useNavigation();

    const { start } = useCopilot();
    const { copilotEvents } = useCopilot();

    useEffect(() => {
        const listener = () => {
            // Copilot tutorial finished!
            navigation.navigate('ChallengeGameBoard')
        };
        copilotEvents.on("stop", listener);
        return () => {
            copilotEvents.off("stop", listener)
        };
    }, [])

    const user = useSelector(state => state.auth.user);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const zoomAnimation = {
        transform: [{ scale: scaleValue }],
    };

    const zoom = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.2, duration: 500, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
            scaleValue.setValue(1);
        });
    }, [scaleValue]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            zoom();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [zoom]);

    useEffect(() => {
        zoom();
    }, []);

    // const practiceBoosts = [
    //     {
    //         "id": 1,
    //         "icon": require('../../../../assets/images/timefreeze-boost.png'),
    //         "count": 20,
    //         "boostName": 'TIME FREEZE'
    //     },
    //     {
    //         "id": 2,
    //         "icon": require('../../../../assets/images/skip-boost.png'),
    //         "count": 20,
    //         "boostName": 'SKIP'
    //     }
    // ]
    return (
        <View style={styles.container} >
            <PlayGameHeader />
            <Animated.View style={zoomAnimation}>
                <Pressable onPress={() => start()} style={{
                    alignItems: 'center', marginTop: 30, backgroundColor: '#E15220',
                    borderRadius: 13, paddingVertical: 10
                }}>
                    <Text style={styles.title}>Click to start tutorial</Text>
                </Pressable>
            </Animated.View>
            <View style={styles.gameProgressAndBoost}>
                <View style={styles.availableBoosts}>
                    <View style={styles.boostinfo}>
                        <Text style={styles.title}>{user.username}, score higher with boost</Text>
                    </View>
                    <View style={styles.availableBoostsIcons}>
                        <CopilotStep text="Use Time Freeze to freeze time for 1 min" order={1} name="freeze">
                            <ChallengePracticeFreeze />
                        </CopilotStep>
                        <CopilotStep text="Use Skip to skip a question" order={2} name="skip">
                            <ChallengePracticeSkip />
                        </CopilotStep>
                    </View>

                </View>

            </View>

            <SelectedPlayers user={user} />
            <CopilotStep text="Answer all questions before the time runs out" order={3} name="timer">
                <RenderQuestion />
            </CopilotStep>


        </View>
    )
}


const PlayGameHeader = () => {

    return (
        <View style={styles.header}>
            <View></View>
            <Text style={styles.headerTextStyle}>Challenge Player</Text>
            <Pressable>
                <Text style={styles.headerTitle}>Exit</Text>
            </Pressable>
        </View>
    )
};


const ChallengePracticeFreeze = ({ copilot }) => {

    return (
        <Pressable style={styles.boostContainer} {...copilot}>
            <View style={styles.boostDetailsHead}>
                <Image
                    source={require('../../../../assets/images/timefreeze-boost.png')}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
            </View>
        </Pressable>
    )
}
const ChallengePracticeSkip = ({ copilot }) => {

    return (
        <Pressable style={styles.boostContainer} {...copilot}>
            <View style={styles.boostDetailsHead}>
                <Image
                    source={require('../../../../assets/images/skip-boost.png')}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
            </View>
        </Pressable>
    )
}

const SelectedPlayers = ({ user }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

            <Image
                source={require('../../../../assets/images/versus.png')}
            />
            <SelectedPlayer playerName='Practice Bot' playerAvatar={require("../../../../assets/images/user-icon.png")} />
        </View>
    )
}

const SelectedPlayer = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.avatarBackground}>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
            <Text style={styles.username}>@{playerName}</Text>
        </View>
    )
}

const RenderQuestion = ({ onComplete, copilot }) => {
    const options = [
        {
            "id": 1,
            "title": 'Manchester City'
        },
        {
            "id": 2,
            "title": 'Chelsea'
        },
        {
            "id": 3,
            "title": 'Arsenal'
        },
        {
            "id": 4,
            "title": 'Manchester United'
        }
    ]
    return (

        <View style={styles.questionsContainer}>
            <View style={styles.timerContainer}>
                <Text style={styles.questionCount}>Q1</Text>
                <View {...copilot}>
                    <CountdownCircleTimer
                        isPlaying
                        duration={60}
                        colors={['#F2C8BC', '#E15220', '#E15220']}
                        colorsTime={[60 / 2, 60 / 4, 0]}
                        trailColor="#E15220"
                        size={50}
                        strokeWidth={5}
                        key={1}
                        onComplete={onComplete}

                    >
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={styles.timeText}>
                                {remainingTime}
                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>
                </View>
            </View>
            <View style={styles.gameQuestions}>
                <Text style={styles.questions}>Which Premier League club has won the most titles?</Text>
            </View>
            <Text style={styles.pickText}>Pick correct answer</Text>
            <View style={styles.options}>
                {options.map((option, i) => <RenderOption option={option} key={i} />)}
            </View>
            <AppButton text='Next' />
        </View>
    )
}

const RenderOption = ({ option }) => {
    return (
        <Pressable style={styles.answer}>
            <Ionicons name="ellipse-outline" size={30} color='#D9D9D9' />
            <Text style={styles.optionText}>{option.title}</Text>
        </Pressable>
    )
}

export default ChallengePracticeTourScreen;

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
    },
    image: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(13),
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        textAlign: 'center',
        fontSize: '1.2rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },
    headerTitle: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },
    gameProgressAndBoost: {
        display: 'flex',
        shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        marginVertical: normalize(18),
        backgroundColor: '#AAD880',
        paddingVertical: '1rem'
    },
    availableBoosts: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    availableBoostsIcons: {
        flexDirection: 'row',
        marginTop: '1rem'

    },
    boostinfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    title: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '.85rem'
    },
    boostContainer: {
        alignItems: 'center',
        marginHorizontal: '1rem'
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: '.5rem'
    },
    boostIcon: {
        width: '2rem',
        height: '2rem',
    },
    storeItemName: {
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
        color: '#FFF',
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 13,
        marginBottom: '1rem',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'
    },
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginTop: '.8rem'
    },
    questionsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        paddingHorizontal: '1.3rem',
        paddingVertical: '1rem',
        marginBottom: '5.5rem'
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        marginBottom: '.8rem'
    },
    gameQuestions: {
        marginBottom: normalize(20)

    },
    questions: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        lineHeight: normalize(26)
    },
    timeText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
    },
    questionCount: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        color: '#072169',
    },
    answer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '1rem',
        height: responsiveScreenWidth(8),
        // backgroundColor: 'red',
    },
    optionText: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '0.9rem',
    },

})