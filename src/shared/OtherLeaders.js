import * as React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';
import { useRef } from 'react';
import { Animated } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowUserPosition } from '../features/CommonSlice';
import { useNavigation } from '@react-navigation/native';

export default function OtherLeaders({ leaders }) {
    const scrollViewRef = React.useRef(null);
    const user = useSelector(state => state.auth.user)
    const showUserPosition = useSelector(state => state.common.showUserPosition)
    const currentLeadedrs = leaders?.slice(3, leaders.length) ?? null;
    const userIndex = currentLeadedrs.findIndex(leader => leader.username === user.username);
    const dispatch = useDispatch()
    const navigation = useNavigation()
    if (currentLeadedrs === null) {
        return <></>;
    }

    React.useEffect(() => {
        // Scroll to the user's position when the component mounts
        if (showUserPosition && userIndex) {
            scrollToUserPosition();
            setTimeout(() => {
                dispatch(setShowUserPosition(false))
                navigation.navigate('Dashboard')
            }, 5000);

        } else {
            return
        }
    }, [leaders]);

    const ITEM_HEIGHT = 60;
    const scrollToUserPosition = () => {
        if (scrollViewRef.current) {
            if (userIndex >= 0) {
                const positionY = userIndex * ITEM_HEIGHT;
                scrollViewRef.current.scrollToOffset({ offset: positionY, animated: true, duration: 1000 });
            }
        }
    };

    const renderItem = ({ item, index }) => (
        <OtherLeader leader={item} position={formatNumber(index + 4)} myPosition={item.username === user.username} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={scrollViewRef}
                data={currentLeadedrs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: responsiveHeight(2) }}
                initialNumToRender={currentLeadedrs.length}
            />
            {currentLeadedrs.length === 0 &&
                <View style={{ height: responsiveHeight(30), justifyContent: 'center' }}>
                    <Text style={otherLeaderStyles.noData}>No data</Text>
                </View>
            }
        </View>
    );
}
function OtherLeader({ leader, position, myPosition, otherName }) {
    const showUserPosition = useSelector(state => state.common.showUserPosition)
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const zoomIn = Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      });
  
      const zoomOut = Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      });
  
      const animate = () => {
        Animated.sequence([zoomIn, zoomOut]).start(() => {
          // Animation completed, restart animation
          animate();
        });
      };
  
      animate();
    }, [scaleValue]);
  
    return (
        <Animated.View style={[otherLeaderStyles.container, myPosition && showUserPosition ? {transform: [{ scale: scaleValue  }], borderWidth: 2, borderColor: '#FFAA00' } : {}]}>
            <View style={otherLeaderStyles.avatar}>
                <Image
                    style={otherLeaderStyles.profilePic}
                    source={
                        isTrue(leader.avatar) ?
                            { uri: `${Constants.manifest.extra.assetBaseUrl}/${leader.avatar}` } :
                            require("../../assets/images/user-icon.png")}
                />
                <View style={otherLeaderStyles.username}>
                    <Text style={[otherLeaderStyles.names, otherName]}>{`${leader.username}`}</Text>
                    <Text style={otherLeaderStyles.point}>{formatNumber(leader.points)} pts</Text>
                </View>
            </View>
            <View style={otherLeaderStyles.position}>
                <View style={otherLeaderStyles.rank}>
                    <Text style={otherLeaderStyles.rankText}>{position}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#0A1F45',
        paddingTop: responsiveScreenWidth(3),
        paddingBottom: responsiveHeight(15),
        marginTop: responsiveScreenWidth(3),
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        height: responsiveHeight(50),
    },
});


const otherLeaderStyles = EStyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: responsiveScreenWidth(10),
        alignItems: 'center',
        borderColor: ' rgba(95, 89, 89, 0.54)',
        borderBottomWidth: 1,
        paddingVertical: responsiveHeight(100) * 0.015,
        paddingHorizontal: 10,
        height: 75
    },
    profilePic: {
        width: normalize(48),
        height: normalize(48),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    arrow: {
        marginLeft: normalize(7)
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    position: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        marginLeft: normalize(20),
    },
    names: {
        color: '#fff',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
        marginTop: '.3rem'
    },
    rankText: {
        color: '#fff',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
    },
    point: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
        marginTop: '.3rem'
    },
    noData: {
        textAlign: 'center',
        color: '#FFFF',
        fontSize: '0.9rem',
        fontFamily: 'graphik-bold',
    },
});