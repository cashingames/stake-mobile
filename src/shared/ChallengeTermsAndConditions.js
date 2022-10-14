import React from "react";
import { ScrollView, Text, View } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import AppButton from "./AppButton";


const ChallengeTermsAndConditions = ({ onClose, staking, finalStakingWinAmount, amountStaked }) => {
    const periodBeforeChallengeStakingExpiry = useSelector(state => state.common.periodBeforeChallengeStakingExpiry);

    return (
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionHeader}>Ready to start winning? Let’s get started
                    by reading the following instructions carefully.
                </Text>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0031'}.</Text>
                    <Text style={styles.instructionText}>There are 10 questions per session.
                        You are required to answer these 10 questions in 60 seconds</Text>
                </View>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0032'}.</Text>
                    <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
                        progress to the next question. You can also see your competitor’s progress
                        opposite yours on the upper right corner of your screen.
                    </Text>
                </View>
                <View style={styles.instruction}>
                    <Text style={styles.unicode}>{'\u0033'}.</Text>
                    <Text style={styles.instructionText}>At the end of the session, you will see
                        your total score against that of your competitor.
                    </Text>
                </View>
                {staking &&
                    <View>
                        <Text style={styles.TermsHeader}>Terms and Conditions</Text>
                        <View style={styles.instruction}>
                            <Text style={styles.unicode}>{'\u0031'}.</Text>
                            <Text style={styles.instructionText}>
                                If you do not accept this challenge in {periodBeforeChallengeStakingExpiry}, your opponent will be refunded and the challenge will be canceled.
                            </Text>
                        </View>
                        <View style={styles.instruction}>
                            <Text style={styles.unicode}>{'\u0032'}.</Text>
                            <Text style={styles.instructionText}>
                                This challenge is a winner-take-all challenge. The winner of the challenge wins {finalStakingWinAmount} naira.
                            </Text>
                        </View>
                        <View style={styles.instruction}>
                            <Text style={styles.unicode}>{'\u0033'}.</Text>
                            <Text style={styles.instructionText}>If this challenge ends in a draw, the challenger and
                                the opponent would be credited individually with the amount staked ({amountStaked} naira)
                            </Text>
                        </View>
                    </View>
                }
                <AppButton text="OK" onPress={onClose} style={styles.button} />
            </View>
    )
}

export default ChallengeTermsAndConditions;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    instructionsContainer: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: normalize(14),
        paddingHorizontal: normalize(15),
    },
    instruction: {
        flexDirection: 'row',
        marginBottom: normalize(10)
    },
    instructionHeader: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.3rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80),
        marginBottom: normalize(12)
    },
    unicode: {
        fontSize: '1.2rem',
        fontFamily: 'graphik-bold',
        color: '#4F4F4F',
        marginRight: normalize(10)
    },
    instructionText: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.3rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80)
    },
    TermsHeader: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
        color: '#4F4F4F',
        lineHeight: '1.3rem',
        textAlign: 'center',
    },
    button: {
        marginTop: normalize(1),
    }
})

