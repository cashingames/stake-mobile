import { View, Text, Dimensions, Alert, Platform, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { StyleSheet } from 'react-native';
import Dashboard from './screens/dashboard';
import Notification from './screens/notification';
import Drawer from './screens/drawer';
import Challenge from './screens/challenge';
import Store from './screens/store';
import GlobalLeaderboard from './screens/globalLeaderboard';
import PrizePool from './screens/prizePool';
import PopupPrizePool from './screens/popupPrizePool';
import Invite from './screens/invite';
import { useNavigation } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { BackHandler } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
export const STEP_NUMBER_RADIUS = 14;
export const STEP_NUMBER_DIAMETER = STEP_NUMBER_RADIUS * 2;
export const ZINDEX = 100;
export const MARGIN = 13;
export const OFFSET_WIDTH = 4;
export const ARROW_SIZE = 6;

const ToolTipButton = ({ wrapperStyle, style, ...rest }) => (
    <View style={[toolTipStyle.button, wrapperStyle]}>
      <Text style={[toolTipStyle.buttonText, style]} {...rest} />
    </View>
  );

export const defaultToolTip = ({
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    labels,
  })=>{

    const _navigation = useNavigation()

    const endTour = ()=>{
        _navigation.reset({
            index: 0,
            routes: [{name: 'AppRouter'}],
        })
        // _navigation.navigate("AppRouter")
    }
    return (
        <View>
            <View style={[toolTipStyle.tooltipContainer, { padding: 12}]}>
                <Text testID="stepDescription" style={toolTipStyle.tooltipText}>{currentStep.text}</Text>
            </View>
            <View style={[toolTipStyle.bottomBar]}>
            {/* {
                !isLastStep ?
                <TouchableOpacity onPress={() => endTour()}>
                    <ToolTipButton>{labels.skip || 'Skip'}</ToolTipButton>
                </TouchableOpacity>
                : null
            } */}
            <TouchableOpacity onPress={() => endTour()}>
                <ToolTipButton>{'End'}</ToolTipButton>
            </TouchableOpacity>
            {
                !isFirstStep ?
                <TouchableOpacity onPress={handlePrev}>
                    <ToolTipButton>{labels.previous || 'Previous'}</ToolTipButton>
                </TouchableOpacity>
                : null
            }
            {
                !isLastStep ?
                <TouchableOpacity onPress={handleNext}>
                    <ToolTipButton>{labels.next || 'Next'}</ToolTipButton>
                </TouchableOpacity> :
                <TouchableOpacity onPress={handleStop}>
                    <ToolTipButton>{labels.finish || 'Finish'}</ToolTipButton>
                </TouchableOpacity>
            }
            </View>
        </View>
    )
}

export default function TourIndex() {
    const navigation = useNavigation();
    const [activeScreen, setActiveScreen] = useState(0)
    const user = useSelector(state => state.auth.user)

    const scrollRef = useRef();

    const goToNext = ()=>{
        // console.warn(Object.keys(scrollRef.current));
        (scrollRef.current).scrollToIndex({
            index: activeScreen + 1
        });
        setActiveScreen(activeScreen + 1);
    }

    const finishTour = async () =>{
        try{
            navigation.popToTop()
            navigation.reset({
                index: 0,
                routes: [{name: 'AppRouter'}],
              })
              await analytics().logEvent('tour_ended', {
                'id': user.username,
                'email': user.email
            })
            navigation.navigate("AppRouter")
        }catch(e){
            navigation.reset({
                index: 0,
                routes: [{name: 'AppRouter'}],
              })
            navigation.navigate("AppRouter")
        }
    }

    useEffect(() => {
        
        try{
            if(Platform.OS == 'android'){
                // BackHandler.addEventListener('hardwareBackPress', navigation.goBack());
            }
        }catch(e){
            console.log(e)
        }
    
      return () => {
        // BackHandler.addEventListener('hardwareBackPress', null);
      }
    }, [])
    
    return (
        <View style={styles.container}>
            <SwiperFlatList
                index={activeScreen}
                ref={ref => scrollRef.current = ref}
                // renderAll
                >
                    <Dashboard width={width} goToNext={()=> goToNext()} />
                    <Notification activeScreen={activeScreen} id={1} width={width} goToNext={()=> goToNext()} />
                    <Drawer activeScreen={activeScreen} id={2} width={width} goToNext={()=> goToNext()}  />
                    <Challenge activeScreen={activeScreen} id={3} width={width} goToNext={()=> goToNext()}  />
                    <Store activeScreen={activeScreen} id={4} width={width} goToNext={()=> goToNext()}  />
                    <GlobalLeaderboard activeScreen={activeScreen} id={5} width={width} goToNext={()=> goToNext()}  />                    
                    <PrizePool activeScreen={activeScreen} id={6} width={width} goToNext={()=> goToNext()}  />                    
                    <PopupPrizePool activeScreen={activeScreen} id={7} width={width} goToNext={()=> goToNext()}  />                    
                    <Invite activeScreen={activeScreen} id={8} width={width} goToNext={()=> finishTour()}  />                    
            </SwiperFlatList>

            {/* <View style={{ 
                position: 'absolute',
                bottom: 60,
                right: 60,
                zIndex: 999999999
             }}>
                <Text style={{ 
                    backgroundColor: 'white',
                    color: 'black',
                    fontWeight: '600',
                    padding: 8
                 }} onPress={()=>{
                    Alert.alert('reached')
                 }}>skip</Text>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  child: { width, justifyContent: 'center' },
});

export const triggerTour = (navigation)=>{
    // removing tour for now
    return
    setTimeout(()=>{
        Alert.alert("Need a Tour ?", "", [
            {
                text: "I'm Good",
                style: 'cancel',
                onPress: async () => {
                  await analytics().logEvent('new_user_tour_skipped', {
                    'action': 'new user tour skipped' 
                })
              }
            },
            {
                text: "Sure",
                style: "default",
                onPress: async () => {
                  await analytics().logEvent('new_user_tour_started', {
                    'action': 'new user tour started'                   
                })
                    navigation.navigate("AppTour")
                }
            }
        ])
    }, 4000)
}

const toolTipStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: ZINDEX,
      },
      arrow: {
        position: 'absolute',
        borderColor: 'transparent',
        borderWidth: ARROW_SIZE,
      },
      tooltip: {
        position: 'absolute',
        paddingTop: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
      },
      tooltipText: {
    
      },
      tooltipContainer: {
        flex: 1,
      },
      stepNumberContainer: {
        position: 'absolute',
        width: STEP_NUMBER_DIAMETER,
        height: STEP_NUMBER_DIAMETER,
        overflow: 'hidden',
        zIndex: ZINDEX + 1,
      },
      stepNumber: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: STEP_NUMBER_RADIUS,
        borderColor: '#FFFFFF',
        backgroundColor: '#27ae60',
      },
      stepNumberText: {
        fontSize: 10,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
      },
      button: {
        padding: 10,
      },
      buttonText: {
        color: '#27ae60',
      },
      bottomBar: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      overlayRectangle: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      overlayContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
})