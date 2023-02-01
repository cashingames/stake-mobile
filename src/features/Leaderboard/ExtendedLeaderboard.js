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
// import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
// import { Walkthroughable } from '../Tour/Walkthrouable';


function ExtendedLeaderboard(props) {
    // const CopilotProps = props;
    const navigation = props.navigation;

    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    // console.log(leaders,'extended leaders')
    const categoryLeaders = useSelector(state => state.common.categoryLeaders)
    const [loading, setLoading] = useState(true);

    // const isTourActive = useSelector(state => state.tourSlice.isTourActive);
    const [forceRender, setForceRender] = useState(true);
    const globalCount = useRef(0);

    // const handleTourStop = ()=>{
    //     console.log("tour stopped, going to next screen to continue")
    //     // console.error(Object.keys(navigation))
    //     navigation.navigate("Home", {reload: true})
    // }

    // const handleTourChange = (step)=>{
    //     console.log(step.name)
    // }

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         if(isTourActive?.payload || isTourActive){
                
    //             CopilotProps.start()
    //             CopilotProps.copilotEvents.on('stepChange', handleTourChange)
    //             CopilotProps.copilotEvents.on('stop', handleTourStop)
    
    //             return () => {
    //             CopilotProps.copilotEvents.off('stepChange', handleTourChange)
    //             CopilotProps.copilotEvents.off('stop', handleTourStop)
    //             }
    //         }else{
                
    //         }
    //     }, 1000)
    // }, [isTourActive])


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
                    
                    {/* <CopilotStep text={
                            <View>
                                <Text style={styles.tourTitle} >Global Leaderboard</Text>
                                <Text>View your position on the leaderboard and continue to play more games to move up the leaderboard</Text>
                            </View>
                        } order={1} name="Order1">
                            <Walkthroughable> */}
                                <GlobalLeaderboard leaders={leaders} />
                            {/* </Walkthroughable>
                    </CopilotStep> */}
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

// export default copilot({
//     animated: true,
//     overlay: 'svg',
//     labels: {
//         finish: 'Next'
//     }
// })(ExtendedLeaderboard);
export default ExtendedLeaderboard;

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
