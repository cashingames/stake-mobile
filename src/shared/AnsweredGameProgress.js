import React from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";

const AnsweredGameProgress = () => {

    const index = useSelector(state => state.game.currentQuestionPosition);
    const total = useSelector(state => state.game.totalQuestionCount);

    return (
        <View style={styles.questionsAnsweredContainer}>
            <AnimatedCircularProgress
                size={60}
                width={5}
                fill={((index + 1) / total * 100)}
                tintColor="#2D9CDB"
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#fff">
                {
                    (fill) => (
                        <Text style={styles.questionsAnswered}>
                            {`${index + 1}/${total}`}
                        </Text>
                    )
                }
            </AnimatedCircularProgress>
        </View>
    );
}
export default AnsweredGameProgress;

const styles = EStyleSheet.create({
    questionsAnsweredContainer: {
        marginRight: normalize(20)
    },
    questionsAnswered: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
})