import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView } from 'react-native';
import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { fetchTrivia } from '../CommonSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import PageLoading from '../../shared/PageLoading';
import LiveTriviaCardComponent from '../../shared/LiveTriviaCardComponent';



const LiveTriviasScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [loading, setLoading] = useState(true)

    const trivia = useSelector(state => state.common.trivias)
    console.log(trivia)
    useEffect(() => {
        dispatch(fetchTrivia()).then(() => setLoading(false));
    }, []);

    if (loading) {
        return <PageLoading />
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.boards}>
                {trivia.map((trivia, i) => <LiveTriviaCardComponent key={i} trivia={trivia} />)}
            </View>
        </ScrollView>
    )
}



export default LiveTriviasScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
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
        borderTopRightRadius: normalize(10),
        borderTopLeftRadius: normalize(10),
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(18),
        backgroundColor: '#FFFF',
    },
    mainContainer: {
        marginVertical: normalize(10),
    },
    boardheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(5),
    },
    disabled: {
        backgroundColor: '#2D9CDB',
        paddingVertical: normalize(5),
        // borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: normalize(15),
        borderTopWidth: 0,
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
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaClosed: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaStageContainer: {
        backgroundColor: '#EF2F55',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(10),
        // borderRadius: 15,
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
        width: normalize(9),
        height: normalize(9)
    },
    dateSubContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dates: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(8),
        opacity: 0.6
    },
    notEnoughPoints: {
        color: '#151C2F',
        fontSize: Platform.OS === 'ios' ? '0.9rem' : '0.8rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
    },
    expired: {
        color: '#EF2F55',
        fontSize: Platform.OS === 'ios' ? '0.7rem' : '0.6rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
    },
    leaderboardLink: {
        color: '#FFFF',
        fontSize: Platform.OS === 'ios' ? '0.65rem' : '0.6rem',
        fontFamily: 'graphik-medium',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
        textAlign: 'center'
    },
    leaderboardContainer: {
        backgroundColor: '#808080',
        borderRadius: 18,
        paddingHorizontal: Platform.OS === 'ios' ? normalize(9) : normalize(10),
        alignItems: 'center',
        paddingVertical: Platform.OS === 'ios' ? normalize(.1) : normalize(3),
    }
});