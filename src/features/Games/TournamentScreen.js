import React from 'react'
import { Text, View, ScrollView, Image, Pressable } from 'react-native';
import normalize from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import { useNavigation } from '@react-navigation/core';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';



const TournamentScreen = () => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <ScrollView style={styles.container}>
            <View>
                <TournamentHeaderTitle />
                <TournamentBoards />
                <TriviaBoard />
            </View>
        </ScrollView>
    )
}

const TournamentHeaderTitle = () => {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>
                Available Tournaments
            </Text>
        </View>
    )
}

const TournamentBoards = () => {
    var boards =
        [
            {
                name: 'Naija @60 2022',
                stage: 'Knockout',
                prize: 100000,
                points_required: 500,
                start_dateTime: '1 October 2022',
                end_dateTime: '1 October 2022',
            },
            {
                name: 'Naija @60 2022',
                stage: 'Knockout',
                prize: 100000,
                points_required: 500,
                start_dateTime: '1 October 2022',
                end_dateTime: '1 October 2022',
            },
            {
                name: 'Naija @60 2022',
                stage: 'Knockout',
                prize: 100000,
                points_required: 500,
                start_dateTime: '1 October 2022',
                end_dateTime: '1 October 2022',
            },
        ]
    return (
        <>
            {boards.map((tournament, i) => <TournamentBoard key={i} tournament={tournament} />)}
        </>
    )
}

const TournamentBoard = ({ tournament }) => {
    return (
        <>
            <View style={styles.boardContainer}>
                <View style={styles.boardheader}>
                    <Text style={styles.competitionName}>{tournament.name}</Text>
                    <View style={styles.stageContainer}>
                        <Text style={styles.competitionStage}>{tournament.stage}</Text>
                    </View>
                </View>
                <View style={styles.prizeContainer}>
                    <Text style={styles.prizeHeader}>Grand Prize</Text>
                    <Text style={styles.prize}>&#8358;{formatCurrency(tournament.prize)}</Text>
                </View>
                <View style={styles.pointContainer}>
                    <Image
                        style={styles.icon}
                        source={require('../../../assets/images/points-coin.png')}
                    />
                    <Text style={styles.points}>{tournament.points_required}pts required</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>Start: {tournament.start_dateTime}</Text>
                    </View>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>End: {tournament.end_dateTime}</Text>
                    </View>
                </View>
                {/* <TriviaParticipants /> */}
            </View>
        </>
    )
}

const TriviaParticipant = ({ participant }) => {
    return (
        <>
            <Text>{participant.image}</Text>
        </>
    )
}

const TriviaParticipants = () => {
    return (
        <>
            <Text></Text>
        </>
    )
}

const TriviaBoard = ({ trivia }) => {
    const navigation = useNavigation();
    var trivia =
    {
        name: 'Grammy Awards 2022',
        stage: 'Live trivia',
        prize: 100000,
        points_required: 500,
        start_dateTime: '1 October 2022',
        end_dateTime: '1 October 2022',
    }
    return (
        <>
            <View style={styles.boardContainer}>
                <View style={styles.boardheader}>
                    <Text style={styles.competitionName}>{trivia.name}</Text>
                    <Pressable style={styles.triviaStageContainer} onPress={() => navigation.navigate('TriviaInstructions')}>
                        <Text style={styles.triviaStage}>{trivia.stage}</Text>
                    </Pressable>
                </View>
                <View style={styles.prizeContainer}>
                    <Text style={styles.prizeHeader}>Grand Prize</Text>
                    <Text style={styles.prize}>&#8358;{formatCurrency(trivia.prize)}</Text>
                </View>
                <View style={styles.pointContainer}>
                    <Image
                        style={styles.icon}
                        source={require('../../../assets/images/points-coin.png')}
                    />
                    <Text style={styles.points}>{trivia.points_required}pts required</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>End: {trivia.start_dateTime}</Text>
                    </View>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>Start: {trivia.end_dateTime}</Text>
                    </View>
                </View>
                {/* <TriviaParticipants /> */}
            </View>
        </>
    )
}

export default TournamentScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
    },
    titleContainer: {
        marginVertical: normalize(20),
    },
    title: {
        fontSize: '1.2rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    boardContainer: {
        borderRadius: normalize(10),
        borderColor: '#E5E5E5',
        borderWidth: 1,
        marginVertical: normalize(10),
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(18)
    },
    boardheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(5),
    },
    competitionName: {
        fontSize: '0.8rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    competitionStage: {
        fontSize: '0.6rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    triviaStage: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaStageContainer: {
        backgroundColor: '#2D9CDB',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(10),
        borderRadius: 15,
        alignItems: 'center'
    },
    stageContainer: {
        backgroundColor: '#3BEB9C',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(10),
        borderRadius: 15,
        alignItems: 'center'
    },
    prizeHeader: {
        fontSize: '0.65rem',
        color: '#685959',
        fontFamily: 'graphik-medium',
        opacity: 0.6,
        marginBottom: normalize(5)
    },
    prize: {
        fontSize: '0.8rem',
        color: '#271212',
        fontFamily: 'graphik-medium',
    },
    prizeContainer: {
        marginBottom: normalize(10)
    },
    pointContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: normalize(8),
        alignItems: 'center'
    },
    points: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(5),
        opacity: 0.6
    },
    icon: {
        width: normalize(11),
        height: normalize(11)
    },
    dateSubContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dates: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(5),
        opacity: 0.6
    }
});