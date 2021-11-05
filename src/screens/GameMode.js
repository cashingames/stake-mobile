import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderBack from '../components/HeaderBack';

export default function GameMode({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('GameScreen')} />
                    <Text style={styles.headerTextStyle}>Play Game</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.content}>
                        <Text style={styles.chooseMode}>Choose your mode</Text>
                        <View>
                            <AvailableMode modeTitle='Exhibition' modeDescription='Play single'
                                modeIcon={require('../../assets/images/single_icon.png')}
                                backgroundColor='#E2F5EA'
                                onPress={() => navigation.navigate('GameInstructions')}
                            />
                            <AvailableMode modeTitle='Challenge' modeDescription='Challenge a friend to a duel'
                                modeIcon={require('../../assets/images/duel_icon.png')}
                                backgroundColor='#FAEEFF'
                                onPress={() => navigation.navigate('GameInstructionsDuel')}
                            />
                            <AvailableMode modeTitle='Tournament' modeDescription='Play Tournament'
                                modeIcon={require('../../assets/images/tournament.png')}
                                backgroundColor='#FCF4DB'
                                onPress={() => navigation.navigate('GameInstructionsTournament')}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const AvailableMode = ({ modeTitle, modeDescription, modeIcon, backgroundColor, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.modeContainer, { backgroundColor: backgroundColor }]}
            onPress={onPress}
        >
            <View>
                <Text style={styles.modeTitle}>{modeTitle}</Text>
                <Text style={styles.modeDescription}>{modeDescription}</Text>
            </View>
            <Image
                source={modeIcon}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
        paddingBottom: normalize(150)
    },
    content: {
        marginHorizontal: normalize(18),

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        backgroundColor: '#FFFF',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    chooseMode: {
        fontSize: normalize(20),
        color: '#000',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10),
    },
    modeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: normalize(30),
        paddingBottom: normalize(20),
        paddingHorizontal: normalize(10),
        borderRadius: 9,
        alignItems: 'flex-end',
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        marginVertical: normalize(10)
    },
    modeTitle: {
        fontSize: normalize(14),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    modeDescription: {
        fontSize: normalize(10),
        color: '#4F4F4F',
        fontFamily: 'graphik-medium',
        opacity: 0.7
    }
});
