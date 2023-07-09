import React, { useEffect, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import * as Progress from 'react-native-progress';
import { Image } from "react-native";
import { formatNumber } from "../../utils/stringUtl";
import { useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AppButton from "../../shared/AppButton";
import { Ionicons } from "@expo/vector-icons";
import {
    CopilotProvider,
    CopilotStep,
    useCopilot,
} from "react-native-copilot";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../../shared/CustomAlert";




const GamePracticeTourScreen = () => {
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
        <View style={styles.image}>
            <CopilotProvider>
                <Practice alertMessage={alertMessage} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            </CopilotProvider>
   
        </View>
    )
}

const Practice = ({modalVisible, setModalVisible, alertMessage}) => {

    const navigation = useNavigation();

    const { start } = useCopilot();
    const { copilotEvents } = useCopilot();

    useEffect(() => {
        const listener = () => {
            // Copilot tutorial finished!
            navigation.navigate('GameInProgress')
        };
        copilotEvents.on("stop", listener);
        return () => {
            copilotEvents.off("stop", listener)
        };
    }, [])

    return (
        <View style={styles.container}>
            <PlayGameHeader />
            <View style={styles.gameProgressAndBoost}>
                <GameTopicProgress />
                <View style={styles.boostItems}>
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
                alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={start} />

        </View>
    )
}

const PlayGameHeader = () => {

    return (
        <View style={styles.header}>
            <View></View>
            <Text style={styles.headerTextStyle}>Trivia game</Text>
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
                    source={require('../../../assets/images/timefreeze-boost.png')}
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
                    source={require('../../../assets/images/skip-boost.png')}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
            </View>
        </Pressable>
    )
}

const GameTopicProgress = () => {

    return (
        <View style={styles.topicProgress}>
            <GameTopicContainer />
        </View>
    )
}

const GameTopicContainer = () => {
    const gameCategory = useSelector(state => state.game.gameCategory.name);
    return (
        <View style={styles.topicContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryName}>{gameCategory}</Text>
                <View style={styles.demoContainer}>
                    <Image
                        source={require('../../../assets/images/star.png')}
                        style={styles.starIcon}
                    />
                    <Text style={styles.demoText}>Demo game</Text>
                </View>
            </View>
            <AnsweredGameProgress index={4} total={10} />
            <Text style={styles.questionsAnswered}>
                {`${4 + 1}/${10}`}
            </Text>
        </View>
    )
}

const AnsweredGameProgress = ({ index, total }) => {

    return (
        <View style={styles.questionsAnsweredContainer}>
            <Progress.Bar progress={(index + 1) / total}
                width={130} color='#E15220' unfilledColor='#F2C8BC' borderWidth={0} height={12}
            />
        </View>
    );
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

export default GamePracticeTourScreen;

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
    },
    image: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(15),
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
    questionsAnsweredContainer: {
        marginVertical: normalize(12)
    },

    topicProgress: {
        borderBottomWidth: 1,
        borderColor: '#93939336',
        paddingVertical: normalize(18),
        // paddingHorizontal:'1.3rem'
    },

    topicContainer: {
        paddingHorizontal: '1rem'
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    categoryName: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.85rem'
    },
    demoContainer: {
        backgroundColor: '#E15220',
        borderRadius: 30,
        paddingHorizontal: '.5rem',
        paddingVertical: '.1rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    demoText: {
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
        fontSize: '0.6rem'
    },
    questionsAnswered: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    gameProgressAndBoost: {
        borderWidth: 1,
        borderColor: '#93939336',
        borderRadius: 13,
        marginTop: '1.5rem',
        backgroundColor: '#fff',
        marginBottom: '1rem'
    },
    starIcon: {
        width: '.7rem',
        height: '.7rem'
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem',
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1rem'
    },
    storeItemName: {
        fontSize: '.85rem',
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
    boostItems: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '1rem',
        paddingVertical: '.7rem'
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