import React, { useEffect, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import { formatNumber, isTrue } from "../../../utils/stringUtl";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import Constants from 'expo-constants';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../../shared/AppButton";
import { useNavigation } from "@react-navigation/native";
import * as Progress from 'react-native-progress';
import {
    CopilotProvider,
    CopilotStep,
    useCopilot,
} from "react-native-copilot";
import CustomAlert from "../../../shared/CustomAlert";
import { Platform } from "react-native";



const ChallengePracticeTourScreen = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setModalVisible(true)
    }


    useEffect(() => {
        startModal()
        setAlertMessage("Click to start tutorial");
    }, [])



    return (
        <>
            {
                Platform.OS === 'ios' &&
                <View style={styles.image}>
                    <CopilotProvider overlay="svg" >
                        <Practice alertMessage={alertMessage} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                    </CopilotProvider>
                </View>
            }


            {
                Platform.OS === 'android' &&
                <View style={styles.image}>
                    <CopilotProvider verticalOffset={32} overlay="svg" margin={10}>
                        <Practice alertMessage={alertMessage} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                    </CopilotProvider>
                </View>
            }
        </>
    )
}

const Practice = ({ modalVisible, setModalVisible, alertMessage }) => {
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


    return (
        <View style={styles.container} >
            <PlayGameHeader />
            <View style={styles.gameProgressAndBoost}>
                <GameTopicProgress />
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10 }}>
                    <CopilotStep text="Use Time Freeze to freeze time for 10 seconds" order={1} name="freeze">
                        <ChallengePracticeFreeze />
                    </CopilotStep>
                    <CopilotStep text="Use Skip to skip a question" order={2} name="skip">
                        <ChallengePracticeSkip />
                    </CopilotStep>
                </View>
            </View>
            <CopilotStep text="Answer all questions before the time runs out" order={3} name="timer">
                <RenderQuestion />
            </CopilotStep>
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                textLabel={alertMessage} buttonLabel='Ok, got it'
                alertImage={require('../../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={start} />

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

const GameTopicProgress = () => {

    return (
        <View style={styles.topicProgress}>
            <GameTopicContainer />
        </View>
    )
}

const GameTopicContainer = () => {
    const gameCategory = useSelector(state => state.game.gameCategory.name);
    const user = useSelector(state => state.auth.user);
    const index = 0;
    const total = 10;

    return (
        <View style={styles.topicContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>{gameCategory}</Text>
                <AnsweredGameProgress index={index} total={total} />
                <Text style={styles.questionsAnswered}>
                    {`${index + 1}/${total}`}
                </Text>

            </View>
            <View>
                <View style={styles.demoContainer}>
                    <Image
                        source={require('../../../../assets/images/star.png')}
                        style={styles.starIcon}
                    />
                    <Text style={styles.demoText}>Demo game</Text>
                </View>
                <SelectedPlayers user={user} />
            </View>
        </View>
    )
}

const AnsweredGameProgress = ({ index, total }) => {

    return (
        <View style={styles.questionsAnsweredContainer}>
            <Progress.Bar progress={(index + 1) / total}
                width={130} color='#E15220' unfilledColor='#F2C8BC' borderWidth={0} height={14} borderRadius={32}
            />
        </View>
    );
}


const ChallengePracticeFreeze = ({ copilot }) => {

    return (
        <View style={styles.boostItems} {...copilot}>

            <Image {...copilot}
                source={require('../../../../assets/images/timefreeze-boost.png')}
                style={styles.boostIcon}
            />
            <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
        </View>

    )
}
const ChallengePracticeSkip = ({ copilot }) => {

    return (
        <View style={styles.boostItems} {...copilot}>
            <Image
                source={require('../../../../assets/images/skip-boost.png')}
                style={styles.boostIcon}
            />
            <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
        </View>
    )
}

const SelectedPlayers = () => {
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const user = useSelector(state => state.auth.user);
    const username = user.username?.charAt(0) + user.username?.charAt(1);
    const opponentName = challengeDetails.opponent?.username?.charAt(0) + challengeDetails.opponent?.username?.charAt(1)
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerAvatar={username} backgroundColor='#ccded48c' />
            <SelectedPlayer playerAvatar={opponentName} backgroundColor='#FEECE7' />
        </View>
    )
}

const SelectedPlayer = ({ playerAvatar, backgroundColor }) => {
    return (
        <View style={[styles.avatarContent, { backgroundColor: backgroundColor }]}>
            <Text style={styles.avatarText}>{playerAvatar}</Text>
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
                        // isPlaying
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
        color: '#1C453B',
    },
    headerTitle: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-medium',
        color: '#1C453B',
    },
    gameProgressAndBoost: {
        display: 'flex',
        borderRadius: 16,
        marginVertical: normalize(18),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'

    },
    topicProgress: {
        borderBottomWidth: 1,
        borderColor: '#93939336',
        paddingVertical: normalize(18),
        paddingHorizontal: '.3rem'
    },
    topicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '1rem'
    },
    categoryContainer: {
        flexDirection: 'column',
    },
    stakeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingHorizontal: '.4rem',
        paddingVertical: '.2rem'
    },
    stakeHeader: {
        fontSize: '0.65rem',
        fontFamily: 'gotham-medium',
        color: '#FFF',
    },
    categoryName: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        width: '8rem',
        marginBottom: '.8rem'
    },
    questionsAnswered: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.85rem',
        marginTop: '.7rem'
    },
    oddContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    oddTitle: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddText: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '0.8rem',
        marginLeft: '.3rem'
    },
    demoContainer: {
        backgroundColor: '#E15220',
        borderRadius: 30,
        paddingHorizontal: '.35rem',
        paddingVertical: '.3rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    demoText: {
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
        fontSize: '0.7rem'
    },
    starIcon: {
        width: '.7rem',
        height: '.7rem'
    },
    storeItemName: {
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
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },
    boostItems: {
        flexDirection: 'row',
        marginRight: '1.5rem',
    },
    playerImage: {
        flexDirection: 'row',
        marginTop: '.7rem'
    },
    avatarContent: {
        borderRadius: 100,
        width: '2.3rem',
        height: '2.3rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        textTransform: 'uppercase',
        fontFamily: 'gotham-medium',
        fontSize: '0.8rem',
        color: '#1C453B'
    },

    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(10),
        paddingHorizontal: '.5rem'
    },

    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
    },
    boostActive: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: normalize(5),
        padding: normalize(7),
        shadowColor: 'rgba(0, 0, 0, 0.75)',
        shadowOffset: { width: -1, height: 1 },
    },
    boostContainer: {

    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1rem'
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem',
    },
    storeItemName: {
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
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
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
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        marginBottom: '.8rem'
    },
    gameQuestions: {
        marginBottom: normalize(20)

    },
    questions: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        lineHeight: normalize(26)
    },
    timeText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
    },
    questionCount: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        color: '#1C453B',
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    answer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '1rem',
        height: responsiveScreenWidth(8),
        // backgroundColor: 'red',
    },
    optionText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
    },


})