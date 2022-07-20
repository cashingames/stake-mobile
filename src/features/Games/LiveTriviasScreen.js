import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, Text, StatusBar} from 'react-native';
import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { fetchRecentLiveTrivia } from '../CommonSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import PageLoading from '../../shared/PageLoading';
import LiveTriviaCard from '../LiveTrivia/LiveTriviaCard';
import { useFocusEffect } from '@react-navigation/native';



const LiveTriviasScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [loading, setLoading] = useState(true)

    const trivia = useSelector(state => state.common.trivias)
    useEffect(() => {
        dispatch(fetchRecentLiveTrivia()).then(() => setLoading(false));
    }, []);

    useEffect(() => {
        StatusBar.setBackgroundColor('#072169');
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBackgroundColor('#FFFF');
            StatusBar.setBarStyle('dark-content');
        }
    },[]);

    if (loading) {
        return <PageLoading
            backgroundColor='#072169'
            spinnerColor="#FFFF"
        />
    }

    return (
        <ScrollView style={styles.container}>
            {trivia ?
                <View style={styles.boards}>
                    {trivia.map((trivia, i) => <TriviaCardContainer key={i} trivia={trivia} />)}
                </View>
                :
                <Text style={styles.noLiveTrivia}>No recent live trivia</Text>
            }
        </ScrollView>
    )
}

const TriviaCardContainer = ({ trivia }) => {
    return (
        <View style={styles.cardContainer}>
            <LiveTriviaCard trivia={trivia} />
        </View>
    )
}



export default LiveTriviasScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        paddingHorizontal: normalize(18),
    },
    cardContainer: {
        margin: normalize(8),
    },
    noLiveTrivia: {
        textAlign: 'center',
        fontSize: '.8rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    }
});