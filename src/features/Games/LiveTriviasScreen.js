import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';
import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { fetchRecentLiveTrivia } from '../CommonSlice';
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
        dispatch(fetchRecentLiveTrivia()).then(() => setLoading(false));
    }, []);

    if (loading) {
        return <PageLoading />
    }

    return (
        <ScrollView style={styles.container}>
            {trivia ?
                <View style={styles.boards}>
                    {trivia.map((trivia, i) => <LiveTriviaCardComponent key={i} trivia={trivia} />)}
                </View>
                :
                <Text style={styles.noLiveTrivia}>No recent live trivia</Text>
            }
        </ScrollView>
    )
}



export default LiveTriviasScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        paddingHorizontal: normalize(18),
    },
    noLiveTrivia: {
        textAlign: 'center',
        fontSize: '.8rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    }
});