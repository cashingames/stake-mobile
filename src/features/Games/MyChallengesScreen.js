import React, { useEffect, useState } from 'react'
import { Text, View, Pressable, StatusBar, FlatList } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../../shared/LottieAnimations';
import { useFocusEffect } from '@react-navigation/native';
import PageLoading from '../../shared/PageLoading';
import { getUserChallenges } from '../CommonSlice';
import AppButton from '../../shared/AppButton';


const MyChallengesScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [pageNumber, setPageNumber] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const challenges = useSelector(state => state.common.userChallenges);
    const loadMoreChallenges = useSelector(state => state.common.loadMoreChallenges);

    useEffect(()=>{
        setPageNumber(getPageNo());
    }, [])


    useEffect(() => {

        if(!pageNumber){
            return;
        }
        if(!loadMoreChallenges ){
            setLoadingMore(false)
            setLoading(false)
            return;
        }

        setLoadingMore(true)
        dispatch(getUserChallenges(pageNumber))
            .then(() => {
                console.log("fetching page ", pageNumber)
                setLoading(false)
                setLoadingMore(false)
            })
    }, [pageNumber, loadMoreChallenges]);

    const loadMoreItems = () => {
        console.log("loading more")
        if(!loadMoreChallenges)
            return;
        //check if length of transactions has changed
        setPageNumber(getPageNo())
    }

    const getPageNo = () => parseInt(challenges.length/10) + 1;


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

    const checkScores = (item) => {
        navigation.navigate('MyChallengesScore', {
            challengeId: item.challengeId
        })

    }
    const renderItem = ({ item }) => {
        const challengeDeclined = item.status === "DECLINED"
        const challengeExpired = item.status === "EXPIRED"
        return < View style={styles.challengeContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.challengeCategory}>{item.subcategory}</Text>
                {item.status === "CLOSED" ?
                    <>
                        {item.flag === "WON" &&
                            <View style={styles.winnerContainer}>
                                <Text style={styles.winner}>WON</Text>
                                <LottieAnimations
                                    animationView={require('../../../assets/trophy.json')}
                                    height={normalize(32)}
                                />
                            </View>
                        }
                        {item.flag === "LOST" &&
                            <View style={styles.winnerContainer}>
                                <Text style={styles.winner}>LOST</Text>
                                <LottieAnimations
                                    animationView={require('../../../assets/loser.json')}
                                    height={normalize(30)}
                                />
                            </View>
                        }
                        {item.flag === "DRAW" &&

                            <View style={styles.winnerContainer}>
                                <Text style={styles.winner}>DRAW</Text>
                                <LottieAnimations
                                    animationView={require('../../../assets/trophy.json')}
                                    height={normalize(30)}
                                />
                            </View>
                        }
                    </>
                    :
                    <LottieAnimations
                        animationView={require('../../../assets/challenge.json')}
                        height={normalize(50)}
                    />
                }
            </View>
            <Text style={styles.status}>{item.date}</Text>
            <Text style={styles.status}>STATUS : {item.status}</Text>
            <View style={styles.competitorsContainer}>
                <Text style={styles.challenger}>{item.playerUsername}</Text>
                <Text style={styles.versus}>vs</Text>
                <Text style={styles.opponent}>{item.opponentUsername}</Text>
            </View>
            <AppButton
                onPress={() => checkScores(item)}
                disabled={challengeDeclined || challengeExpired}
                text={item.status === "DECLINED" ? "Declined" : item.status === "EXPIRED" ? "Expired" : [item.status === "CLOSED" ? "Scores" : "View challenge details"]}
            />
        </View>
    }

    const renderLoader = () => {
        return (
            <>
                {loadingMore ?
                    <PageLoading
                        backgroundColor='#701F88'
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
            backgroundColor='#701F88'
            spinnerColor="#FFFF"
        />
    }

    return (
        <View style={styles.container}>
            {challenges.length > 0 ?
                <FlatList
                    data={challenges}
                    renderItem={renderItem}
                    keyExtractor={item => item.challengeId}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.2}
                />
                :
                <NoChallenges />

            }
        </View>

    )
}


const NoChallenges = () => {
    return (
        < View style={styles.noTransactionContainer}>
            <LottieAnimations
                animationView={require('../../../assets/challenge.json')}
                height={normalize(100)}
            />
            <Text style={styles.noTransaction}>
                You dont have any challenge yet. Challenge a friend to play exciting and fun games
            </Text>
        </View>
    )
}

export default MyChallengesScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#701F88',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(5)

    },
    challengeContainer: {
        marginVertical: responsiveScreenWidth(3),
        backgroundColor: '#FFFF',
        borderRadius: 16,
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(12)
    },
    challengeCategory: {
        fontSize: '1rem',
        color: '#6895FF',
        fontFamily: 'graphik-bold',
    },
    status: {
        fontSize: '.75rem',
        color: '#701F88',
        fontFamily: 'graphik-medium',
        opacity: 0.4
    },
    winner: {
        fontSize: '.75rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
        opacity: 0.4,
        marginRight: '.8rem'
    },
    winnerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    versus: {
        fontSize: '.9rem',
        color: '#9236AD',
        fontFamily: 'graphik-regular',
    },
    opponent: {
        fontSize: '1rem',
        color: '#FF716C',
        fontFamily: 'graphik-medium',
    },
    challenger: {
        fontSize: '1rem',
        color: '#2D9CDB',
        fontFamily: 'graphik-medium',
    },
    competitorsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(5),
        alignItems: 'center'

    },
    scoresButton: {
        backgroundColor: '#EF2F55',
        alignItems: 'center',
        paddingVertical: normalize(10),
        marginTop: normalize(15),
        borderRadius: 5
    },
    scoresText: {
        fontSize: '.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    },
    noTransaction: {
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        color: '#FFFF',
        lineHeight: '1.5rem',
        textAlign: 'center',
        marginTop: responsiveScreenWidth(8)
    },
    noTransactionContainer: {
        display: 'flex',
        marginVertical: responsiveScreenWidth(40),
        paddingHorizontal: normalize(18),
        alignItems: 'center'
    },

});