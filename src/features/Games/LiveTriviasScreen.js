import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, Text, StatusBar, FlatList } from 'react-native';
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
    const [pageNumber, setPageNumber] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)

    const trivia = useSelector(state => state.common.trivias)
    console.log(trivia)
    useEffect(() => {
        setLoadingMore(true)
        dispatch(fetchRecentLiveTrivia(pageNumber))
            .then(() => {
                console.log("fetching page ", pageNumber)
                setLoading(false)
                setLoadingMore(false)
            });
    }, [pageNumber]);


    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    const triviaCardContainer = ({ item }) => {
        return (
            <View style={styles.cardContainer}>
                <LiveTriviaCard trivia={item} />
            </View>
        )
    }

    const renderLoader = () => {
        return (
            <>
                {loadingMore ?
                    <PageLoading
                        backgroundColor='#072169'
                        spinnerColor="#FFFF"
                    />
                    :
                    <></>
                }

            </>
        )
    }

    if (loading) {
        return <PageLoading
            backgroundColor='#072169'
            spinnerColor="#FFFF"
        />
    }

    return (
        // <ScrollView style={styles.container}>
        // <View style={styles.boards}>
        //     {trivia.map((trivia, i) => <TriviaCardContainer key={i} trivia={trivia} />)}
        // </View>
        <View style={styles.container}>

            {trivia.length > 0 ?
                <View style={styles.boards}>
                    <FlatList
                        data={trivia}
                        renderItem={triviaCardContainer}
                        keyExtractor={item => item.id}
                        ListFooterComponent={renderLoader}
                        onEndReached={() => setPageNumber(pageNumber + 1)}
                        onEndReachedThreshold={0.2}

                    />
                </View>
                :
                <Text style={styles.noLiveTrivia}>No recent live trivia</Text>
            }

        </View>
        // </ScrollView>
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