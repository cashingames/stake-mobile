import * as React from 'react';
import { Platform, View } from 'react-native';
import { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import TopLeader from './TopLeader';


function GlobalTopLeaders({ leaders }) {

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };
    return (
        <View style={styles.content}>
            {topLeaders.length > 0 ? <>
                <TopLeader
                    podPosition={require('../../assets/images/position3.png')}
                    name={`${thirdLeader.username}`}
                    point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                    avatar={thirdLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position1.png')}
                    name={`${firstLeader.username}`}
                    point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                    avatar={firstLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position2.png')}
                    name={`${secondLeader.username}`}
                    point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                    avatar={secondLeader.avatar} />
            </> : <></>
            }
        </View>
    )
}
export default GlobalTopLeaders;

const styles = EStyleSheet.create({
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#FAC502',
        paddingHorizontal: responsiveScreenWidth(7),
        paddingTop: responsiveScreenWidth(7),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        // borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        // borderColor:Platform.OS === 'ios' ? '#E0E0E0': '#FFFF'
    },

});
