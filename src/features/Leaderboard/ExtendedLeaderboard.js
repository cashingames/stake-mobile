import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StatusBar, Alert } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import GlobalTopLeaders from '../../shared/GlobalTopLeaders';
import OtherLeaders from '../../shared/OtherLeaders';
import {
    getCategoryLeaders,
    getGlobalLeaders,
} from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import {
    useTourGuideController, // hook to start, etc.
} from 'rn-tourguide'

export default function ExtendedLeaderboard({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    // console.log(leaders,'extended leaders')
    const categoryLeaders = useSelector(state => state.common.categoryLeaders)
    const [loading, setLoading] = useState(true);

    const isTourActive = useSelector(state => state.common.isTourActive);
    const [forceRender, setForceRender] = useState(true);
    const globalCount = useRef(0);

    const {
        canStart, // a boolean indicate if you can start tour guide
        start: tourStart, // a function to start the tourguide
        stop: tourStop, // a function  to stopping it
        eventEmitter, // an object for listening some events
        TourGuideZone,
        getCurrentStep
    } = useTourGuideController()

    const handleTourStop = ()=>{
        console.log("tour stopped, going to next screen to continue")
        navigation.navigate("Home")
    }

    useEffect(()=>{
        setTimeout(()=>{
            if(isTourActive?.payload || isTourActive){
                tourStart(6)
                setForceRender(!forceRender);
                console.log(canStart, 6)

                eventEmitter.on('stop', handleTourStop)
                eventEmitter.on('stepChange', (v)=>{
                    globalCount.current = globalCount.current + 1;
                    if(globalCount.current >= 2 ){
                        navigation.navigate("Home")
                    }
                })
    
                return () => {
                eventEmitter.off('stop', handleTourStop)
                eventEmitter.off('stepChange', ()=>{})
                globalCount.current = 0;
                }
            }else{
                // console.log(AppTourStep)
                // AppTour.start();
                // AppTour.stop();
            }
        }, 1000)
    }, [isTourActive, canStart])


    useEffect(() => {
        dispatch(getGlobalLeaders());
        dispatch(getCategoryLeaders())
        setLoading(false)
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeaders());
            dispatch(getCategoryLeaders());
        }, [])
    );

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

    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    const categories = Object.keys(categoryLeaders);

    // listen for tour
    return (
        <View style={styles.container}>
            
            <ScrollView>
            <View style={styles.animation}>
                <LottieAnimations
                    animationView={require('../../../assets/gamepadii.json')}
                    width={normalize(200)}
                    height={normalize(200)}
                />
            </View>
                <SwiperFlatList showPagination paginationActiveColor='red' renderAll={true} >
                    <TourGuideZone zone={6} text={
                        <View>
                            <Text style={styles.tourTitle} >Global Leaderboard</Text>
                            <Text>View your position on the leaderboard and continue to play more games to move up the leaderboard</Text>
                        </View>
                    } shape='rectangle_and_keep' isTourGuide={true}>
                        <GlobalLeaderboard leaders={leaders} />
                    </TourGuideZone>
                    {categories.map((c, i) => <CategoryLeaderboard key={i} category={c} leaders={categoryLeaders[c]} />)}
                </SwiperFlatList>
            </ScrollView>
        </View>
    )
}


function GlobalLeaderboard({ leaders }) {
    return (
        <View style={styles.global}>
            <Text style={styles.title}>Global Leaderboard</Text>
            <GlobalTopLeaders leaders={leaders} />
            <OtherLeaders leaders={leaders} otherStyles={styles.otherLeaders} />
        </View>

    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5d5fef',
    },
    animation: {
        alignItems: 'center'
    },
    global: {
        paddingHorizontal: normalize(15),
        marginBottom: normalize(10),
    },
    title: {
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        lineHeight: '2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    dateRange: {
        borderRadius: 5,
        borderColor: '#CDD4DF',
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: responsiveScreenWidth(5),
        marginTop: responsiveScreenWidth(3)
    },
    otherLeaders:{
        backgroundColor: '#FAC502',
    },
    tourTitle: {
        color: '#EF2F55',
        fontWeight: '600',
        fontSize: 22,
        marginBottom: 10
    }
});
