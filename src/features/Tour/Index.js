import { View, Text, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
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

const { width } = Dimensions.get('window');

export default function TourIndex() {

    const [activeScreen, setActiveScreen] = useState(0)
    const scrollRef = useRef();

    const goToNext = ()=>{
        // console.warn(Object.keys(scrollRef.current));
        (scrollRef.current).scrollToIndex({
            index: activeScreen + 1
        });
        setActiveScreen(activeScreen + 1);
    }
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
                    <Invite activeScreen={activeScreen} id={8} width={width} goToNext={()=> goToNext()}  />                    
            </SwiperFlatList>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  child: { width, justifyContent: 'center' },
});