import React from "react";
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import LottieAnimations from "./LottieAnimations";

const GameEndClockAnimation = () => {
    return (
        <View style={styles.emojiContainer}>
            <LottieAnimations
                animationView={require('../../assets/game-over.json')}
                width={normalize(140)}
                height={normalize(125)}
            />
        </View>
    )
}
export default GameEndClockAnimation;

const styles = EStyleSheet.create({
    emojiContainer: {
        alignItems: 'center',
    },
})