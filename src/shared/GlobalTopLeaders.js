import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import normalize from '../utils/normalize';
import { formatNumber } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import TopLeader from './TopLeader';


function GlobalTopLeaders({ leaders }) {

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { first_name: "..." };
    const secondLeader = topLeaders[1] ?? { first_name: "..." };
    const thirdLeader = topLeaders[2] ?? { first_name: "..." };
    return (
        <View style={styles.content}>
            {topLeaders.length > 0 ? <>
                <TopLeader
                    podPosition={require('../../assets/images/position3.png')}
                    name={`${thirdLeader.first_name} ${thirdLeader.last_name}`}
                    point={`${formatNumber(thirdLeader.points)} pts`}
                    avatar={thirdLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position1.png')}
                    name={`${firstLeader.first_name} ${firstLeader.last_name}`}
                    point={`${formatNumber(firstLeader.points)} pts`}
                    avatar={firstLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position2.png')}
                    name={`${secondLeader.first_name} ${secondLeader.last_name}`}
                    point={`${formatNumber(secondLeader.points)} pts`}
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
        paddingHorizontal: normalize(30),
        paddingTop: normalize(25),
        borderRadius: 10,
    },

});
