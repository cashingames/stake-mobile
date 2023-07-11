import React from "react";
import { View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import AnsweredGameProgress from "./AnsweredGameProgress";
import { Image } from "react-native";
import { formatCurrency } from "../utils/stringUtl";



const GameTopicProgress = () => {

    return (
        <View style={styles.topicProgress}>
            <GameTopicContainer />
        </View>
    )
}

const GameTopicContainer = () => {
    const gameCategory = useSelector(state => state.game.gameCategory.name);
    const index = useSelector(state => state.game.currentQuestionPosition);
    const total = useSelector(state => state.game.totalQuestionCount);
    const practiceMode = useSelector(state => state.game.practiceMode);
    const cashMode = useSelector(state => state.game.cashMode);

    return (
        <View style={styles.topicContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>{gameCategory}</Text>
                {cashMode &&
                    <StakeDetails />
                }
                {practiceMode &&
                    <View style={styles.demoContainer}>
                        <Image
                            source={require('../../assets/images/star.png')}
                            style={styles.starIcon}
                        />
                        <Text style={styles.demoText}>Demo game</Text>
                    </View>
                }
            </View>
            <AnsweredGameProgress index={index} total={total} />
                <Text style={styles.questionsAnswered}>
                    {`${index + 1}/${total}`}
                </Text>
        </View>
    )
}
const StakeDetails = () => {
    const amountStaked = useSelector(state => state.game.amountStaked);


    return (
        <View style={styles.stakeContainer}>
            <Text style={styles.stakeHeader}>STK.</Text>
            <Text style={styles.stakeHeader}>&#8358;{amountStaked}</Text>

        </View>
    )
}
export default GameTopicProgress;

const styles = EStyleSheet.create({
    topicProgress: {
        borderBottomWidth: 1,
        borderColor: '#93939336',
        paddingVertical: normalize(18),
        paddingHorizontal:'.3rem'
    },

    topicContainer: {
        paddingHorizontal: '1rem'
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    stakeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#FA5F4A',
        borderRadius: 30,
        paddingHorizontal:'.4rem',
        paddingVertical:'.2rem'
    },
    stakeHeader: {
        fontSize: '0.65rem',
        fontFamily: 'gotham-medium',
        color: '#FFF',
    },
    categoryName: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        width: '8rem'
    },
    questionsAnswered: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    oddTitle: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddText: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '0.8rem',
        marginLeft: '.3rem'
    },
    demoContainer: {
        backgroundColor: '#E15220',
        borderRadius: 30,
        paddingHorizontal: '.5rem',
        paddingVertical: '.1rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    demoText: {
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
        fontSize: '0.6rem'
    },
    starIcon: {
        width: '.7rem',
        height: '.7rem'
    },

})